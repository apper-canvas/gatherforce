import { useEffect } from 'react';

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showPromptPassword('#authentication-prompt-password');
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div id="authentication-prompt-password" className="bg-surface mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-lg"></div>
        </div>
    );
};

export default PromptPassword;