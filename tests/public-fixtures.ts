export const testContact = { id: '1', businessName: 'MotoApex Costa Rica', phone: '', whatsapp: '', email: '', address: '', latitude: null, longitude: null, hours: [], logoUrl: 'https://images.example.test/logo.png', faviconUrl: 'https://images.example.test/favicon.png' }
export const emptyPublicData = (kind: string | undefined) => kind === 'contact' ? testContact : []
