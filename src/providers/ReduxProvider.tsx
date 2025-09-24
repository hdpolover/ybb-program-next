"use client";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/slices/store';
import Loader from '@/components/Common/Loader';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader message="Loading application..." />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}