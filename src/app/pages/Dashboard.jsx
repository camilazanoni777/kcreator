'use client'

import DashboardCasal from '@/components/dashboard/DashboardCasal';
import DashboardIndividual from '@/components/dashboard/DashboardIndividual';
import { usePlan } from '@/lib/PlanContext';

export default function Dashboard() {
  const { isIndividual } = usePlan();
  return isIndividual ? <DashboardIndividual /> : <DashboardCasal />;
}
