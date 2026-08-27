import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Transaction, RiskAssessment } from '@/types';
import api from '@/services/api';
import RiskMeter3D from '@/components/three/RiskMeter3D';
import RiskFactorViz from '@/components/three/RiskFactorViz';
import { Loader2, ArrowLeft, Shield, MapPin, User, Cpu } from 'lucide-react';

const TransactionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<{ transaction: Transaction, assessment: RiskAssessment } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        // Support both backend API shape and mock adapter shape
        const transaction = res.data.transaction ?? res.data;
        const assessment = res.data.riskAssessment ?? res.data.assessment;
        setData({ transaction, assessment });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="flex h-full min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-cyan-400 w-12 h-12" /></div>;
  if (!data) return <div className="text-red-400 text-center mt-20">Transaction not found</div>;

  const { transaction: tx, assessment: risk } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white transition-colors mb-4">
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Transaction Details</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-gray-500 text-sm flex items-center"><User size={14} className="mr-2"/> Customer</div>
                <div className="text-white font-medium">{tx.customerName}</div>
                <div className="text-gray-400 text-xs font-mono">{tx.customerId}</div>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm">Amount</div>
                <div className="text-2xl font-bold text-white">₹{tx.amount.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">{tx.paymentMethod}</div>
              </div>

              <div>
                <div className="text-gray-500 text-sm flex items-center"><MapPin size={14} className="mr-2"/> Location</div>
                <div className="text-white">{tx.location.city}, {tx.location.country}</div>
                <div className="text-gray-400 text-xs font-mono">IP: {tx.ipAddress}</div>
              </div>

              <div>
                <div className="text-gray-500 text-sm">Status</div>
                <div className="text-white capitalize">{tx.status}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center"><Cpu size={18} className="mr-2 text-cyan-400"/> AI Explanation</h3>
             <p className="text-gray-300 text-sm leading-relaxed">{risk.aiExplanation || "No explanation available."}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl h-[400px] flex flex-col relative">
            <h2 className="text-xl font-bold text-white absolute top-6 left-6 z-10 flex items-center">
              <Shield size={20} className="mr-2 text-cyan-400"/> Risk Analysis
            </h2>
            <div className="absolute top-6 right-6 z-10 text-right">
              <div className="text-gray-400 text-sm uppercase">Decision</div>
              <div className={`text-xl font-bold uppercase ${
                risk.decision === 'approve' ? 'text-green-400' :
                risk.decision === 'block' ? 'text-red-400' : 'text-yellow-400'
              }`}>{risk.decision}</div>
            </div>
            
            <div className="flex-1 w-full mt-10">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <RiskMeter3D score={risk.riskScore} />
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
              </Canvas>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl h-[400px]">
            <h3 className="text-lg font-bold text-white mb-4">Risk Factors Breakdown</h3>
            <div className="w-full h-[300px]">
              <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <RiskFactorViz factors={risk.factors} />
                <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
