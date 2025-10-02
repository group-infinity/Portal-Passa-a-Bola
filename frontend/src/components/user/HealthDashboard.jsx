import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHealthDataByUserId } from '../../services/MonitorService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HeartPulse, Droplets, Zap, Timer } from 'lucide-react';
import Loading from '../utils/Loading';

// Componente para o cartão de estatísticas
const StatCard = ({ icon, title, value, unit, colorClass }) => (
    <div className={`flex flex-col rounded-lg border bg-white p-4 shadow-sm ${colorClass}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-4xl font-bold">
        {value}
        <span className="text-xl font-medium">{unit}</span>
      </div>
    </div>
);

// Componente para o tooltip personalizado do gráfico
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white/80 p-3 shadow-md backdrop-blur-sm">
          <p className="font-bold text-gray-700">{`Hora: ${label}`}</p>
          <p style={{ color: '#8884d8' }}>{`BPM: ${payload[0].value}`}</p>
          <p style={{ color: '#82ca9d' }}>{`SpO₂: ${payload[1].value}%`}</p>
        </div>
      );
    }
    return null;
};

// Componente para o Resumo da Sessão
const SessionSummary = ({ sessionData }) => {
    if (!sessionData || sessionData.length < 2) {
        return (
            <div className="flex h-64 items-center justify-center text-center text-gray-500">
                <p>Sessão muito curta ou sem dados para gerar um resumo.<br />Inicie o monitoramento no seu dispositivo.</p>
            </div>
        );
    }

    const firstPoint = sessionData[0];
    const lastPoint = sessionData[sessionData.length - 1];

    const startTime = new Date(firstPoint.originalTimestamp).getTime();
    const endTime = new Date(lastPoint.originalTimestamp).getTime();
    const durationMs = endTime - startTime;
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationSeconds = Math.round((durationMs % 60000) / 1000);

    const bpms = sessionData.map(d => d.bpm);
    const saturations = sessionData.map(d => d.saturation);

    const avgBpm = Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length);
    const avgSaturation = (saturations.reduce((a, b) => a + b, 0) / saturations.length).toFixed(1);

    const calcularFadiga = (bpm, saturation) => {
        const bpmNorm = Math.max(0, (bpm - 60) / (190 - 60));
        const satNorm = Math.max(0, (99 - saturation) / (99 - 94));
        const fadiga = (bpmNorm * 0.7 + satNorm * 0.3) * 100;
        return Math.min(100, Math.round(fadiga));
    };

    const avgFadiga = Math.round(sessionData.reduce((acc, d) => acc + calcularFadiga(d.bpm, d.saturation), 0) / sessionData.length);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<Timer size={20} />} title="Duração" value={`${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`} unit=" min" colorClass="border-l-4 border-l-blue-500" />
            <StatCard icon={<HeartPulse size={20} />} title="BPM Médio" value={avgBpm} unit=" BPM" colorClass="border-l-4 border-l-purple-500" />
            <StatCard icon={<Droplets size={20} />} title="SpO₂ Média" value={avgSaturation} unit=" %" colorClass="border-l-4 border-l-green-500" />
            <StatCard icon={<Zap size={20} />} title="Fadiga Média" value={avgFadiga} unit=" %" colorClass="border-l-4 border-l-yellow-500" />
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Hora</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">BPM</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Saturação O₂</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Índice Fadiga</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sessionData.map(d => (
                        <tr key={d.originalTimestamp}>
                            <td className="px-4 py-2">{d.timestamp}</td>
                            <td className="px-4 py-2">{d.bpm}</td>
                            <td className="px-4 py-2">{d.saturation}%</td>
                            <td className="px-4 py-2">{calcularFadiga(d.bpm, d.saturation)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
};

const HealthDashboard = ({ userId }) => {
    const [data, setData] = useState([]);
    const [sessionData, setSessionData] = useState([]);
    const [isMonitoring, setIsMonitoring] = useState(true);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const calcularFadiga = useCallback((bpm, saturation) => {
        const bpmNorm = Math.max(0, (bpm - 60) / (190 - 60));
        const satNorm = Math.max(0, (99 - saturation) / (99 - 94));
        const fadiga = (bpmNorm * 0.7 + satNorm * 0.3) * 100;
        return Math.min(100, Math.round(fadiga));
    }, []);

    const latestStats = useMemo(() => {
        if (!isMonitoring || data.length === 0) {
          return { bpm: '--', saturation: '--', fadiga: '--' };
        }
        const lastDataPoint = data[data.length - 1];
        const fadiga = calcularFadiga(lastDataPoint.bpm, lastDataPoint.saturation);
        return {
          bpm: lastDataPoint.bpm,
          saturation: lastDataPoint.saturation,
          fadiga: fadiga,
        };
    }, [data, isMonitoring, calcularFadiga]);

    useEffect(() => {
        if (!userId || !token) return;

        const fetchData = async () => {
            try {
                const result = await getHealthDataByUserId(userId, token);

                if (result.length > data.length) {
                    const formattedData = result.map(item => ({
                        ...item,
                        originalTimestamp: item.timestamp,
                        timestamp: new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                    }));
                    setData(formattedData);
                    setLastUpdateTime(Date.now());
                    if (!isMonitoring) {
                        setIsMonitoring(true);
                        setSessionData([]); // Limpa o resumo anterior ao receber novos dados
                    }
                }
            } catch (err) {
                setError(err.message);
            }
        };

        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [userId, token, data.length, isMonitoring]);

    useEffect(() => {
        const timeoutCheck = setInterval(() => {
            if (isMonitoring && (Date.now() - lastUpdateTime > 15000) && data.length > 0) {
                setIsMonitoring(false);
                setSessionData(data);
            }
        }, 1000);

        return () => clearInterval(timeoutCheck);
    }, [lastUpdateTime, isMonitoring, data]);

    return (
      <div className="space-y-6 rounded-lg border bg-gray-50 p-6 shadow-sm">
        <h3 className="text-2xl font-bold">
            {isMonitoring ? "Monitor de Saúde em Tempo Real" : "Resumo da Última Sessão"}
        </h3>

        {error && <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-center text-red-600">Erro: {error}</div>}

        {isMonitoring ? (
            <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard icon={<HeartPulse size={20} />} title="Batimento Cardíaco" value={latestStats.bpm} unit=" BPM" colorClass="border-l-4 border-l-purple-500" />
                    <StatCard icon={<Droplets size={20} />} title="Saturação de O₂" value={latestStats.saturation} unit=" %" colorClass="border-l-4 border-l-green-500" />
                    <StatCard icon={<Zap size={20} />} title="Índice de Fadiga" value={latestStats.fadiga} unit=" %" colorClass="border-l-4 border-l-yellow-500" />
                </div>
                {data.length === 0 ? (
                    <div className="flex h-64 items-center justify-center text-gray-500"><p>A aguardar dados do monitor...</p></div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorSat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" />
                            <YAxis yAxisId="left" domain={['dataMin - 10', 'dataMax + 10']} />
                            <YAxis yAxisId="right" orientation="right" domain={[90, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="bpm" name="BPM" stroke="#8884d8" fill="url(#colorBpm)" />
                            <Area yAxisId="right" type="monotone" dataKey="saturation" name="SpO₂" stroke="#82ca9d" fill="url(#colorSat)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </>
        ) : (
            <SessionSummary sessionData={sessionData} />
        )}
      </div>
    );
};

export default HealthDashboard;