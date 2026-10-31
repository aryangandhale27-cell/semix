import React from 'react';
import { CustomerListUploadModal } from '../../components/bulk-enquiry/CustomerListUploadModal';

export const UploadElectronicsListPage: React.FC = () => (
  <main className="min-h-[60vh] bg-slate-50">
    <CustomerListUploadModal isOpen onClose={() => undefined} displayMode="page" />
  </main>
);
