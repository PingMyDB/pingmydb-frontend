import React from 'react';
import TeamManagement from '../components/TeamManagement';
import { motion } from 'framer-motion';

const TeamPage: React.FC = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 max-w-4xl pb-20"
        >
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Team Management</h1>
                <p className="text-muted-foreground">Manage your team members and their access levels.</p>
            </div>

            <div className="bg-card border rounded-[2.5rem] p-8 shadow-sm">
                <TeamManagement />
            </div>
        </motion.div>
    );
};

export default TeamPage;
