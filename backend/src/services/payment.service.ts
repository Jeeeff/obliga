// Mock implementation of Payment Service
export const processPayment = async (invoiceId: string, amount: number, gateway: 'stripe' | 'mercadopago') => {
    console.log(`Processing payment for invoice ${invoiceId} via ${gateway}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success
    return {
        success: true,
        transactionId: `txn_${Math.random().toString(36).substring(7)}`,
        status: 'approved'
    };
};

export const createPaymentIntent = async () => {
    return {
        clientSecret: `pi_${Math.random().toString(36).substring(7)}_secret_${Math.random().toString(36).substring(7)}`
    };
};
