import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    sales: 'Sales',
    dashboard: 'Dashboard',
    stock: 'Stock',
    history: 'History',
    profile: 'Profile',
    takeOrders: 'Take orders',
    viewStats: 'View statistics',
    manageInventory: 'Manage inventory',
    orderRecords: 'Order records',
    
    // POS
    menu: 'Menu',
    mainDishes: 'Main Dishes',
    addons: 'Add-ons',
    addItem: 'Add Item',
    setTodayLocation: "Set today's location...",
    locationPlaceholder: 'e.g. Pasar Tani Seksyen 7, Shah Alam',
    locationSaved: 'Location saved!',
    change: 'Change',
    currentOrder: 'Current Order',
    noItems: 'No items in order',
    subtotal: 'Subtotal',
    discount: 'Discount',
    total: 'Total',
    cash: 'Cash',
    qrPay: 'QR Pay',
    orderSuccess: 'Order successful!',
    outOfStock: 'Out of stock',
    lowStock: 'low stock',
    soldOut: 'Sold Out',
    available: 'Available',
    unavailable: 'Unavailable',
    
    // QR Confirmation
    confirmQRPayment: 'Confirm QR Payment',
    customerPaidQR: 'Has the customer completed the QR payment?',
    confirmed: 'Confirmed',
    
    // Stock
    stockManagement: 'Stock Management',
    updateInventory: 'Update your inventory',
    refresh: 'Refresh',
    update: 'Update',
    units: 'units',
    currentStock: 'Current stock',
    unlimited: 'Unlimited',
    
    // History
    orderHistory: 'Order History',
    allTransactions: 'All transactions record',
    noOrders: 'No orders',
    ordersWillAppear: 'Orders will appear here',
    order: 'Order',
    today: 'Today',
    thisMonth: 'This Month',
    all: 'All',
    from: 'From',
    to: 'To',
    
    // Dashboard
    totalSales: 'Total Sales',
    orders: 'Orders',
    average: 'Average',
    lowStockItems: 'Low Stock',
    topSelling: 'Top Selling Items',
    salesTrend: 'Sales Trend',
    paymentMethods: 'Payment Methods',
    stockAlert: 'Stock Alert',
    allStockOk: 'All stock sufficient ✓',
    remaining: 'remaining',
    
    // Profile
    myProfile: 'My Profile',
    manageAccount: 'Manage your account and shop info',
    profileInfo: 'Profile Information',
    fullName: 'Full Name',
    shopName: 'Shop/Stall Name',
    phone: 'Phone Number',
    address: 'Address / Market Location',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    profileUpdated: 'Profile updated!',
    accountStatus: 'Account Status',
    status: 'Status',
    active: 'Active',
    plan: 'Plan',
    free: 'Free',
    memberSince: 'Member since',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    english: 'English',
    malay: 'Bahasa Melayu',
    
    // Support
    support: 'Support',
    needHelp: 'Need help?',
    contactSupport: 'Contact Support',
    submitTicket: 'Submit Ticket',
    supportDesc: 'Submit a support ticket and our team will respond as soon as possible',
    subject: 'Subject',
    selectSubject: 'Select a subject',
    message: 'Message',
    describeIssue: 'Describe your issue or question...',
    sendToWhatsApp: 'Send via WhatsApp',
    whatsappNote: 'Your message will be sent to our support team via WhatsApp',
    ticketSubmitted: 'Ticket submitted! Our team will review it shortly.',
    ticketNote: 'Your ticket will be reviewed by our admin team. You can track the status and replies here.',
    myTickets: 'My Tickets',
    noTickets: 'No tickets yet',
    statusOpen: 'Open',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    adminReply: 'Admin Reply',
    sending: 'Sending...',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    registerNow: 'Register now',
    backToLogin: 'Back to login',
    sendResetEmail: 'Send Reset Email',
    resetEmailSent: 'Reset email sent!',
    tryWithoutAccount: 'Try without account',
    logout: 'Logout',
    
    // Modal
    editItem: 'Edit Item',
    addNewItem: 'Add New Item',
    itemName: 'Item name',
    price: 'Price',
    category: 'Category',
    icon: 'Icon',
    stockQty: 'Stock (empty = unlimited)',
    preview: 'Preview',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteConfirm: 'Delete this item?',
    itemAdded: 'Item added!',
    itemUpdated: 'Item updated!',
    itemDeleted: 'Item deleted!',
    stockUpdated: 'Stock updated!',
    insufficientStock: 'Insufficient stock!',
    updateStock: 'Update Stock',
    otherAmount: 'Other amount',
    close: 'Close',
    moreItems: 'more',
    confirmLogout: 'Logout?',
  },
  ms: {
    // Navigation
    sales: 'Jualan',
    dashboard: 'Dashboard',
    stock: 'Stok',
    history: 'Sejarah',
    profile: 'Profil',
    takeOrders: 'Ambil pesanan',
    viewStats: 'Lihat statistik',
    manageInventory: 'Urus inventori',
    orderRecords: 'Rekod pesanan',
    
    // POS
    menu: 'Menu',
    mainDishes: 'Hidangan Utama',
    addons: 'Tambahan',
    addItem: 'Tambah Item',
    setTodayLocation: 'Tetapkan lokasi hari ini...',
    locationPlaceholder: 'cth. Pasar Tani Seksyen 7, Shah Alam',
    locationSaved: 'Lokasi disimpan!',
    change: 'Tukar',
    currentOrder: 'Pesanan Semasa',
    noItems: 'Tiada item dalam pesanan',
    subtotal: 'Jumlah',
    discount: 'Diskaun',
    total: 'Jumlah',
    cash: 'Tunai',
    qrPay: 'QR Pay',
    orderSuccess: 'Pesanan berjaya!',
    outOfStock: 'habis stok',
    lowStock: 'stok rendah',
    soldOut: 'Habis',
    available: 'Tersedia',
    unavailable: 'Tidak Tersedia',
    
    // QR Confirmation
    confirmQRPayment: 'Sahkan Bayaran QR',
    customerPaidQR: 'Adakah pelanggan telah selesai bayaran QR?',
    confirmed: 'Disahkan',
    
    // Stock
    stockManagement: 'Pengurusan Stok',
    updateInventory: 'Kemaskini inventori anda',
    refresh: 'Refresh',
    update: 'Kemaskini',
    units: 'unit',
    currentStock: 'Stok semasa',
    unlimited: 'Tanpa had',
    
    // History
    orderHistory: 'Sejarah Pesanan',
    allTransactions: 'Rekod semua transaksi',
    noOrders: 'Tiada pesanan',
    ordersWillAppear: 'Pesanan akan dipaparkan di sini',
    order: 'Pesanan',
    today: 'Hari Ini',
    thisMonth: 'Bulan Ini',
    all: 'Semua',
    from: 'Dari',
    to: 'Hingga',
    
    // Dashboard
    totalSales: 'Jumlah Jualan',
    orders: 'Pesanan',
    average: 'Purata',
    lowStockItems: 'Stok Rendah',
    topSelling: 'Item Terlaris',
    salesTrend: 'Trend Jualan',
    paymentMethods: 'Kaedah Pembayaran',
    stockAlert: 'Amaran Stok',
    allStockOk: 'Semua stok mencukupi ✓',
    remaining: 'tinggal',
    
    // Profile
    myProfile: 'Profil Saya',
    manageAccount: 'Urus maklumat akaun dan kedai anda',
    profileInfo: 'Maklumat Profil',
    fullName: 'Nama Penuh',
    shopName: 'Nama Kedai/Gerai',
    phone: 'No. Telefon',
    address: 'Alamat / Lokasi Pasar Tani',
    saveChanges: 'Simpan Perubahan',
    saving: 'Menyimpan...',
    profileUpdated: 'Profil dikemaskini!',
    accountStatus: 'Status Akaun',
    status: 'Status',
    active: 'Aktif',
    plan: 'Pelan',
    free: 'Percuma',
    memberSince: 'Ahli sejak',
    
    // Settings
    settings: 'Tetapan',
    language: 'Bahasa',
    english: 'English',
    malay: 'Bahasa Melayu',
    
    // Support
    support: 'Sokongan',
    needHelp: 'Perlukan bantuan?',
    contactSupport: 'Hubungi Sokongan',
    submitTicket: 'Hantar Tiket',
    supportDesc: 'Hantar tiket sokongan dan pasukan kami akan membalas secepat mungkin',
    subject: 'Subjek',
    selectSubject: 'Pilih subjek',
    message: 'Mesej',
    describeIssue: 'Terangkan masalah atau soalan anda...',
    sendToWhatsApp: 'Hantar via WhatsApp',
    whatsappNote: 'Mesej anda akan dihantar ke pasukan sokongan melalui WhatsApp',
    ticketSubmitted: 'Tiket dihantar! Pasukan kami akan menyemak segera.',
    ticketNote: 'Tiket anda akan disemak oleh pasukan admin. Anda boleh pantau status dan balasan di sini.',
    myTickets: 'Tiket Saya',
    noTickets: 'Tiada tiket lagi',
    statusOpen: 'Buka',
    statusInProgress: 'Dalam Proses',
    statusResolved: 'Selesai',
    adminReply: 'Balasan Admin',
    sending: 'Menghantar...',
    
    // Auth
    login: 'Log Masuk',
    register: 'Daftar',
    email: 'Email',
    password: 'Kata Laluan',
    forgotPassword: 'Lupa kata laluan?',
    noAccount: 'Belum ada akaun?',
    registerNow: 'Daftar sekarang',
    backToLogin: 'Kembali ke log masuk',
    sendResetEmail: 'Hantar Email Reset',
    resetEmailSent: 'Email reset dihantar!',
    tryWithoutAccount: 'Cuba tanpa akaun',
    logout: 'Log Keluar',
    
    // Modal
    editItem: 'Edit Item',
    addNewItem: 'Tambah Item Baru',
    itemName: 'Nama item',
    price: 'Harga',
    category: 'Kategori',
    icon: 'Ikon',
    stockQty: 'Stok (kosong = tanpa had)',
    preview: 'Preview',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Padam',
    deleteConfirm: 'Padam item ini?',
    itemAdded: 'Item ditambah!',
    itemUpdated: 'Item dikemaskini!',
    itemDeleted: 'Item dipadam!',
    stockUpdated: 'Stok dikemaskini!',
    insufficientStock: 'Stok tidak mencukupi!',
    updateStock: 'Kemaskini Stok',
    otherAmount: 'Jumlah lain',
    close: 'Tutup',
    moreItems: 'lagi',
    confirmLogout: 'Log keluar?',
  }
};

const LanguageContext = createContext({});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('senangpos_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('senangpos_language', language);
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ms' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
