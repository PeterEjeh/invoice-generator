import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { ClientProvider } from './context/ClientContext';
import { ProductProvider } from './context/ProductContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import EditInvoice from './pages/EditInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Settings from './pages/Settings';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
    return (
        <AuthProvider>
            <InvoiceProvider>
                <ClientProvider>
                    <ProductProvider>
                        <Router>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />

                                {/* Protected routes */}
                                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                    <Route index element={<Dashboard />} />
                                    <Route path="create" element={<CreateInvoice />} />
                                    <Route path="edit/:id" element={<EditInvoice />} />
                                    <Route path="invoice/:id" element={<ViewInvoice />} />
                                    <Route path="clients" element={<Clients />} />
                                    <Route path="products" element={<Products />} />
                                    <Route path="settings" element={<Settings />} />
                                </Route>

                                {/* Catch all - redirect to dashboard */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Router>
                    </ProductProvider>
                </ClientProvider>
            </InvoiceProvider>
        </AuthProvider>
    );
}

export default App;
