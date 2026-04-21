/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Layout from './components/Layout';
import CreatorDashboard from './components/CreatorDashboard';
import Marketplace from './components/Marketplace';
import RevenueDashboard from './components/RevenueDashboard';
import DatasetDetail from './components/DatasetDetail';
import { Dataset } from './types';

type View = 'creator' | 'marketplace' | 'revenue';

export default function App() {
  const [activeView, setActiveView] = useState<View>('marketplace');
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const handleSelectDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
  };

  const handleBackToMarketplace = () => {
    setSelectedDataset(null);
    setActiveView('marketplace');
  };

  const handleViewChange = (view: View) => {
    setActiveView(view);
    setSelectedDataset(null);
  };

  return (
    <Layout activeView={activeView} setActiveView={handleViewChange}>
      {selectedDataset ? (
        <DatasetDetail dataset={selectedDataset} onBack={handleBackToMarketplace} />
      ) : (
        <>
          {activeView === 'creator' && <CreatorDashboard />}
          {activeView === 'marketplace' && <Marketplace onSelectDataset={handleSelectDataset} />}
          {activeView === 'revenue' && <RevenueDashboard />}
        </>
      )}
    </Layout>
  );
}
