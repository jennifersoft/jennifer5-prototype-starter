import '@entry/dashboard/requestAniFrame.js';

import './index.scss';
import { buildDBConnectionPool } from '@entry/dashboard/common';
import storeInChart from '@entry/dashboard/storeInChart';
buildDBConnectionPool(storeInChart, {});
