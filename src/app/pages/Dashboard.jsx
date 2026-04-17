'use client'

import React from 'react';
import { usePlan } from '../lib/PlanContext';
import DashboardIndividual from '../components/dashboard/DashboardIndividual';
import DashboardCasal from '../components/dashboard/DashboardCasal';

export default function Dashboard() {
  const { isIndividual } = usePlan();
  return isIndividual ? <DashboardIndividual /> : <DashboardCasal />;
}