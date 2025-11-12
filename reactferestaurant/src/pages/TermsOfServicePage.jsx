/**
 * TermsOfServicePage Component
 * Terms of service page
 */

import React from 'react';
import { Container, Card } from 'react-bootstrap';
import './TermsOfServicePage.css';

function TermsOfServicePage() {
  return (
    <main className="terms-of-service-page">
      <section style={{ padding: 'var(--ds-space-12) 0' }}>
        <Container>
          <Card className="ds-card">
            <Card.Body>
              <h1 className="page-title mb-4">Điều khoản dịch vụ</h1>
              
              <div className="terms-content">
                <section className="terms-section mb-4">
                  <h2>1. Chấp nhận điều khoản</h2>
                  <p>
                    Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện này. 
                    Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không được sử dụng dịch vụ của chúng tôi.
                  </p>
                </section>

                <section className="terms-section mb-4">
                  <h2>2. Sử dụng dịch vụ</h2>
                  <p>
                    Bạn có thể sử dụng dịch vụ đặt bàn nhà hàng của chúng tôi để tìm kiếm, xem thông tin và đặt bàn tại các nhà hàng. 
                    Bạn cam kết sử dụng dịch vụ một cách hợp pháp và không vi phạm bất kỳ quy định nào.
                  </p>
                </section>

                <section className="terms-section mb-4">
                  <h2>3. Đặt bàn</h2>
                  <p>
                    Khi đặt bàn, bạn cần cung cấp thông tin chính xác và đầy đủ. 
                    Việc đặt bàn có thể yêu cầu thanh toán tiền cọc. 
                    Chính sách hủy và hoàn tiền sẽ được thông báo rõ ràng khi bạn thực hiện đặt bàn.
                  </p>
                </section>

                <section className="terms-section mb-4">
                  <h2>4. Thanh toán</h2>
                  <p>
                    Chúng tôi hỗ trợ nhiều phương thức thanh toán khác nhau. 
                    Tất cả các giao dịch thanh toán đều được xử lý an toàn thông qua các cổng thanh toán được bảo mật.
                  </p>
                </section>

                <section className="terms-section mb-4">
                  <h2>5. Quyền riêng tư</h2>
                  <p>
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. 
                    Vui lòng xem Chính sách bảo mật của chúng tôi để biết thêm chi tiết về cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
                  </p>
                </section>

                <section className="terms-section mb-4">
                  <h2>6. Trách nhiệm</h2>
                  <p>
                    Chúng tôi không chịu trách nhiệm về chất lượng dịch vụ hoặc thực phẩm tại các nhà hàng. 
                    Mọi khiếu nại về dịch vụ tại nhà hàng cần được giải quyết trực tiếp với nhà hàng đó.
                  </p>
                </section>

                <section className="terms-section mb-4">
                  <h2>7. Thay đổi điều khoản</h2>
                  <p>
                    Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. 
                    Các thay đổi sẽ có hiệu lực ngay sau khi được đăng tải trên trang web. 
                    Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn đã chấp nhận các điều khoản mới.
                  </p>
                </section>

                <section className="terms-section">
                  <h2>8. Liên hệ</h2>
                  <p>
                    Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.
                  </p>
                </section>
              </div>

              <div className="terms-footer mt-5 pt-4 border-top">
                <p className="text-muted text-center">
                  <small>
                    Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
                  </small>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </main>
  );
}

export default TermsOfServicePage;

