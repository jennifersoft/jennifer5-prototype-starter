import '@entry/dashboard/requestAniFrame.js';
import { buildChartFromDashboard } from '@entry/dashboard/common';
import './index.scss';
import storeInChart from '@entry/dashboard/storeInChart';

buildChartFromDashboard(storeInChart, {});
