import { UserManagementWithRoster } from './components/UserManagementWithRoster';
import { GuestLinkGenerator } from './components/GuestLinkGenerator';
import { ProductManager } from './components/ProductManager';
import { motion } from 'framer-motion';

interface AdminViewProps {
    activePage: 'roster' | 'inventory' | 'keys';
}

export function AdminView({ activePage }: AdminViewProps) {
    const renderContent = () => {
        switch (activePage) {
            case 'roster':
                return <UserManagementWithRoster />;
            case 'keys':
                return <GuestLinkGenerator />;
            case 'inventory':
                return <ProductManager />;
            default:
                return <UserManagementWithRoster />;
        }
    };

    return (
        <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
        >
            {renderContent()}
        </motion.div>
    );
}
