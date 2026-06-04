import React from 'react';
import { Loader2, TrendingUp, Lock, CheckCircle2 } from 'lucide-react';
import { usePayments } from '../../hooks/usePayments';
import { useProjects } from '../../hooks/useProjects';
import { calcBuilderEligibility } from '../../services/paymentService';
import { Payment } from '../../types';
import EmptyState from '../shared/EmptyState';
import ProgressBar from '../shared/ProgressBar';

function PaymentRow({ payment, projectName }: { key?: React.Key; payment: Payment; projectName: string }) {
  const { builderShareAmount, builderEligible, builderDue, locked } = calcBuilderEligibility(payment);
  const clientPercent = payment.projectValue > 0
    ? Math.round((payment.clientPaidAmount / payment.projectValue) * 100)
    : 0;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">{projectName}</h3>
          <p className="text-white/40 text-xs mt-0.5">
            Your share: {payment.builderSharePercent}% of ৳{payment.projectValue.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-primary font-bold font-mono text-lg">৳{builderShareAmount.toLocaleString()}</p>
          <p className="text-white/30 text-xs">total share</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="text-white/50">Client payment progress</span>
          <span className="text-white font-mono">{clientPercent}%</span>
        </div>
        <ProgressBar percent={clientPercent} showValue={false} color="cyan" />
        <p className="text-white/30 text-xs mt-1">
          ৳{payment.clientPaidAmount.toLocaleString()} of ৳{payment.projectValue.toLocaleString()} received
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <TrendingUp className="w-3.5 h-3.5 text-primary mb-1" />
          <p className="text-primary font-bold font-mono text-sm">৳{builderEligible.toLocaleString()}</p>
          <p className="text-white/40 text-[10px]">Unlocked</p>
        </div>
        <div className={`p-3 rounded-xl ${builderDue > 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/5'}`}>
          <CheckCircle2 className={`w-3.5 h-3.5 mb-1 ${builderDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
          <p className={`font-bold font-mono text-sm ${builderDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>৳{builderDue.toLocaleString()}</p>
          <p className="text-white/40 text-[10px]">{builderDue > 0 ? 'Due to you' : 'All paid'}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <Lock className="w-3.5 h-3.5 text-white/30 mb-1" />
          <p className="text-white/50 font-mono text-sm">৳{locked.toLocaleString()}</p>
          <p className="text-white/30 text-[10px]">Locked</p>
        </div>
      </div>

      <p className="text-white/30 text-xs mt-3">
        Paid to you so far: ৳{payment.builderPaidAmount.toLocaleString()}
      </p>
    </div>
  );
}

export default function PaymentDashboard() {
  const { payments, loading } = usePayments();
  const { projects } = useProjects();

  const projectName = (id: string) => projects.find(p => p.id === id)?.name ?? 'Project';

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  const totalEarnings = payments.reduce((sum, p) => {
    const { builderEligible } = calcBuilderEligibility(p);
    return sum + builderEligible;
  }, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-2xl mb-1">Payments</h2>
          <p className="text-white/40 text-sm">Earnings unlock as clients pay</p>
        </div>
        <div className="text-right">
          <p className="text-primary font-bold font-mono text-xl">৳{totalEarnings.toLocaleString()}</p>
          <p className="text-white/40 text-xs">total unlocked</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No payment records" description="Payment records will appear here once set up by admin." />
      ) : (
        <div className="flex flex-col gap-4">
          {payments.map(p => <PaymentRow key={p.id} payment={p} projectName={projectName(p.projectId)} />)}
        </div>
      )}
    </div>
  );
}
