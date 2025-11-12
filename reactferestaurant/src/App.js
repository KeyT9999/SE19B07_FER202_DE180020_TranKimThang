import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import './styles/restaurant.css';
import './styles/booking.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import BookingPage from './pages/BookingPage';
import BookingListPage from './pages/BookingListPage';
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PaymentFormPage from './pages/PaymentFormPage';
import PaymentResultPage from './pages/PaymentResultPage';
import ReviewsPage from './pages/ReviewsPage';
import MyReviewsPage from './pages/MyReviewsPage';
import CustomerChatPage from './pages/CustomerChatPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationDetailPage from './pages/NotificationDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import Error404Page from './pages/Error404Page';
import Error403Page from './pages/Error403Page';
import Error500Page from './pages/Error500Page';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import VerifyResultPage from './pages/VerifyResultPage';
import OAuthAccountTypePage from './pages/OAuthAccountTypePage';
import BookingDetailPage from './pages/BookingDetailPage';
import BookingEditPage from './pages/BookingEditPage';

// Admin Pages
import AdminRouteGuard from './components/admin/AdminRouteGuard';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserFormPage from './pages/admin/AdminUserFormPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminRestaurantRequestsPage from './pages/admin/AdminRestaurantRequestsPage';
import AdminRestaurantRequestDetailPage from './pages/admin/AdminRestaurantRequestDetailPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminModerationPage from './pages/admin/AdminModerationPage';
import AdminModerationDetailPage from './pages/admin/AdminModerationDetailPage';
import AdminRefundRequestsPage from './pages/admin/AdminRefundRequestsPage';
import AdminVouchersPage from './pages/admin/AdminVouchersPage';
import AdminVoucherFormPage from './pages/admin/AdminVoucherFormPage';
import AdminVoucherDetailPage from './pages/admin/AdminVoucherDetailPage';
import AdminVoucherAnalyticsPage from './pages/admin/AdminVoucherAnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminNotificationFormPage from './pages/admin/AdminNotificationFormPage';
import AdminWithdrawalManagementPage from './pages/admin/AdminWithdrawalManagementPage';
import AdminPartnersPage from './pages/admin/AdminPartnersPage';
import AdminChatPage from './pages/admin/AdminChatPage';

// Restaurant Owner Pages
import RestaurantOwnerRouteGuard from './components/restaurant-owner/RestaurantOwnerRouteGuard';
import RestaurantOwnerDashboardPage from './pages/restaurant-owner/RestaurantOwnerDashboardPage';
import RestaurantOwnerRestaurantsPage from './pages/restaurant-owner/RestaurantOwnerRestaurantsPage';
import RestaurantOwnerRestaurantFormPage from './pages/restaurant-owner/RestaurantOwnerRestaurantFormPage';
import RestaurantOwnerTablesPage from './pages/restaurant-owner/RestaurantOwnerTablesPage';
import RestaurantOwnerServicesPage from './pages/restaurant-owner/RestaurantOwnerServicesPage';
import RestaurantOwnerBookingsPage from './pages/restaurant-owner/RestaurantOwnerBookingsPage';
import RestaurantOwnerBookingDetailPage from './pages/restaurant-owner/RestaurantOwnerBookingDetailPage';
import RestaurantOwnerReviewsPage from './pages/restaurant-owner/RestaurantOwnerReviewsPage';
import RestaurantOwnerAnalyticsPage from './pages/restaurant-owner/RestaurantOwnerAnalyticsPage';
import RestaurantOwnerProfilePage from './pages/restaurant-owner/RestaurantOwnerProfilePage';
import RestaurantOwnerDishesPage from './pages/restaurant-owner/RestaurantOwnerDishesPage';
import RestaurantOwnerDishFormPage from './pages/restaurant-owner/RestaurantOwnerDishFormPage';
import RestaurantOwnerMediaPage from './pages/restaurant-owner/RestaurantOwnerMediaPage';
import RestaurantOwnerMediaUploadPage from './pages/restaurant-owner/RestaurantOwnerMediaUploadPage';
import RestaurantOwnerVouchersPage from './pages/restaurant-owner/RestaurantOwnerVouchersPage';
import RestaurantOwnerVoucherFormPage from './pages/restaurant-owner/RestaurantOwnerVoucherFormPage';
import RestaurantOwnerVoucherDetailPage from './pages/restaurant-owner/RestaurantOwnerVoucherDetailPage';
import RestaurantOwnerWaitlistPage from './pages/restaurant-owner/RestaurantOwnerWaitlistPage';
import RestaurantOwnerWaitlistDetailPage from './pages/restaurant-owner/RestaurantOwnerWaitlistDetailPage';
import RestaurantOwnerWithdrawalPage from './pages/restaurant-owner/RestaurantOwnerWithdrawalPage';
import RestaurantOwnerChatPage from './pages/restaurant-owner/RestaurantOwnerChatPage';
import RestaurantOwnerChatRoomPage from './pages/restaurant-owner/RestaurantOwnerChatRoomPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/register/success" element={<RegisterSuccessPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/verify-result" element={<VerifyResultPage />} />
                  <Route path="/auth/oauth-account-type" element={<OAuthAccountTypePage />} />
                  
                  {/* Booking Routes */}
                  <Route path="/booking/new" element={<BookingPage />} />
                  <Route path="/booking/my" element={<BookingListPage />} />
                  <Route path="/booking/:id" element={<BookingDetailPage />} />
                  <Route path="/booking/:id/edit" element={<BookingEditPage />} />
                  
                  {/* Payment Routes */}
                  <Route path="/payment/form" element={<PaymentFormPage />} />
                  <Route path="/payment/result" element={<PaymentResultPage />} />
                  
                  {/* Review Routes */}
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/reviews/my" element={<MyReviewsPage />} />
                  
                  {/* Customer Routes */}
                  <Route path="/customer/chat" element={<CustomerChatPage />} />
                  <Route path="/customer/favorites" element={<FavoritesPage />} />
                  
                  {/* Notification Routes */}
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/notifications/:id" element={<NotificationDetailPage />} />
                  
                  {/* Profile Routes */}
                  <Route path="/auth/profile" element={<ProfilePage />} />
                  <Route path="/auth/change-password" element={<ChangePasswordPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <AdminRouteGuard>
                      <AdminDashboardPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRouteGuard>
                      <AdminUsersPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/users/new" element={
                    <AdminRouteGuard>
                      <AdminUserFormPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/users/:id/edit" element={
                    <AdminRouteGuard>
                      <AdminUserFormPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/restaurants" element={
                    <AdminRouteGuard>
                      <AdminRestaurantsPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/restaurant-requests" element={
                    <AdminRouteGuard>
                      <AdminRestaurantRequestsPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/restaurant-requests/:id" element={
                    <AdminRouteGuard>
                      <AdminRestaurantRequestDetailPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/reports" element={
                    <AdminRouteGuard>
                      <AdminReportsPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/moderation" element={
                    <AdminRouteGuard>
                      <AdminModerationPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/moderation/:id" element={
                    <AdminRouteGuard>
                      <AdminModerationDetailPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/refund-requests" element={
                    <AdminRouteGuard>
                      <AdminRefundRequestsPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/vouchers" element={
                    <AdminRouteGuard>
                      <AdminVouchersPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/vouchers/new" element={
                    <AdminRouteGuard>
                      <AdminVoucherFormPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/vouchers/:id" element={
                    <AdminRouteGuard>
                      <AdminVoucherDetailPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/vouchers/:id/edit" element={
                    <AdminRouteGuard>
                      <AdminVoucherFormPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/vouchers/:id/analytics" element={
                    <AdminRouteGuard>
                      <AdminVoucherAnalyticsPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/notifications" element={
                    <AdminRouteGuard>
                      <AdminNotificationsPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/notifications/new" element={
                    <AdminRouteGuard>
                      <AdminNotificationFormPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/withdrawal-management" element={
                    <AdminRouteGuard>
                      <AdminWithdrawalManagementPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/partners" element={
                    <AdminRouteGuard>
                      <AdminPartnersPage />
                    </AdminRouteGuard>
                  } />
                  <Route path="/admin/chat" element={
                    <AdminRouteGuard>
                      <AdminChatPage />
                    </AdminRouteGuard>
                  } />
                  
                  {/* Restaurant Owner Routes */}
                  <Route path="/restaurant-owner/dashboard" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerDashboardPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerRestaurantsPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/new" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerRestaurantFormPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/edit" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerRestaurantFormPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/tables" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerTablesPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/services" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerServicesPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/bookings" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerBookingsPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/bookings/:id" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerBookingDetailPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/reviews" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerReviewsPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/analytics" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerAnalyticsPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/profile" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerProfilePage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/dishes" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerDishesPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/dishes/new" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerDishFormPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/dishes/:dishId/edit" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerDishFormPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/media" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerMediaPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/media/upload" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerMediaUploadPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/vouchers" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerVouchersPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/vouchers/new" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerVoucherFormPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/vouchers/:voucherId" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerVoucherDetailPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/vouchers/:voucherId/edit" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerVoucherFormPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/waitlist" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerWaitlistPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/restaurants/:id/waitlist/:waitlistId" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerWaitlistDetailPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/withdrawal" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerWithdrawalPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/chat" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerChatPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  <Route path="/restaurant-owner/chat/:id" element={
                    <RestaurantOwnerRouteGuard>
                      <RestaurantOwnerChatRoomPage />
                    </RestaurantOwnerRouteGuard>
                  } />
                  
                  {/* Error Routes */}
                  <Route path="/error/404" element={<Error404Page />} />
                  <Route path="/error/403" element={<Error403Page />} />
                  <Route path="/error/500" element={<Error500Page />} />
                  
                  {/* Catch all - 404 */}
                  <Route path="*" element={<Error404Page />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;