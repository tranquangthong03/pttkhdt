// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
      icon.addEventListener('click', () => {
        const input = icon.previousElementSibling;
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
      });
    });
      // Xử lý tương tác cho trang tạo học bổng
    const createScholarshipForm = document.getElementById('create-scholarship-form');
    if (createScholarshipForm) {
      // Xử lý chuyển đổi giữa các bước
      const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
      let currentStep = 0;
      
      const nextStepBtn = document.getElementById('next-step');
      const prevStepBtn = document.getElementById('prev-step');
      const submitFormBtn = document.getElementById('submit-form');
      
      // Cập nhật hiển thị bước hiện tại
      function updateStepDisplay() {
        steps.forEach((step, index) => {
          document.getElementById(step).style.display = index === currentStep ? 'block' : 'none';
        });
        
        // Cập nhật các nút điều hướng
        prevStepBtn.style.display = currentStep > 0 ? 'block' : 'none';
        nextStepBtn.style.display = currentStep < steps.length - 1 ? 'block' : 'none';
        submitFormBtn.style.display = currentStep === steps.length - 1 ? 'block' : 'none';
        
        // Cập nhật trạng thái các bước
        document.querySelectorAll('.step').forEach((step, index) => {
          step.classList.remove('active', 'completed');
          if (index === currentStep) {
            step.classList.add('active');
          } else if (index < currentStep) {
            step.classList.add('completed');
          }
        });
        
        // Cập nhật tiến trình
        const completion = Math.round((currentStep + 1) / steps.length * 100);
        document.getElementById('preview-completion').textContent = completion;
        document.querySelector('.preview-card .preview-body div[style^="width: "].background').style.width = `${completion}%`;
      }
      
      // Chuyển đến bước tiếp theo
      nextStepBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          updateStepDisplay();
        }
      });
      
      // Quay lại bước trước
      prevStepBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          updateStepDisplay();
        }
      });
      
      // Xử lý khi gửi form
      submitFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.preview-scholarship .success-animation').style.display = 'flex';
        document.getElementById('navigation-buttons').style.display = 'none';
      });
      
      // Xử lý chọn loại học bổng
      document.querySelectorAll('.scholarship-type-option').forEach(option => {
        option.addEventListener('click', function() {
          // Bỏ chọn tất cả các lựa chọn
          document.querySelectorAll('.scholarship-type-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          
          // Chọn lựa chọn hiện tại
          this.classList.add('selected');
          
          // Cập nhật xem trước
          const scholarshipType = this.querySelector('h4').textContent;
          document.getElementById('preview-type').textContent = scholarshipType;
        });
      });
      
      // Cập nhật xem trước khi thay đổi các trường
      document.getElementById('scholarship-name').addEventListener('input', function() {
        document.getElementById('preview-name').textContent = this.value || '--';
      });
      
      document.getElementById('amount').addEventListener('input', function() {
        document.getElementById('preview-amount').textContent = this.value ? 
          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.value) : 
          '--';
      });
      
      document.getElementById('slots').addEventListener('input', function() {
        document.getElementById('preview-slots').textContent = this.value || '--';
      });
      
      document.getElementById('deadline').addEventListener('input', function() {
        if (this.value) {
          const date = new Date(this.value);
          document.getElementById('preview-deadline').textContent = date.toLocaleDateString('vi-VN');
        } else {
          document.getElementById('preview-deadline').textContent = '--';
        }
      });
      
      // Xử lý tải lên tệp
      document.querySelector('.file-upload').addEventListener('click', function() {
        document.getElementById('template-files').click();
      });
      
      // Xử lý kéo và thả tệp
      const fileUpload = document.querySelector('.file-upload');
      
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUpload.addEventListener(eventName, preventDefaults, false);
      });
      
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      ['dragenter', 'dragover'].forEach(eventName => {
        fileUpload.addEventListener(eventName, highlight, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        fileUpload.addEventListener(eventName, unhighlight, false);
      });
      
      function highlight() {
        fileUpload.classList.add('highlight');
      }
      
      function unhighlight() {
        fileUpload.classList.remove('highlight');
      }
      
      // Xử lý sự kiện xóa tệp đã tải lên
      document.querySelectorAll('.file-actions .delete').forEach(btn => {
        btn.addEventListener('click', function() {
          if (confirm('Bạn có chắc chắn muốn xóa tệp này?')) {
            this.closest('.uploaded-file').remove();
          }
        });
      });
    }
    
    // Xử lý tương tác cho trang duyệt hồ sơ
    const reviewPage = document.querySelector('.review-dashboard');
    if (reviewPage) {
      // Xử lý các sự kiện nút nhấn trong bảng
      document.querySelectorAll('.btn-action').forEach(button => {
        button.addEventListener('click', function() {
          if (this.classList.contains('btn-view')) {
            // Hiển thị modal chi tiết
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).classList.add('show');
          } else if (this.classList.contains('btn-approve')) {
            if (confirm('Bạn có chắc chắn muốn phê duyệt hồ sơ này?')) {
              // Thay đổi trạng thái hàng thành "đã duyệt"
              const row = this.closest('tr');
              const statusCell = row.querySelector('.status-badge');
              statusCell.className = 'status-badge status-approved';
              statusCell.textContent = 'Đã duyệt';
              
              // Cập nhật nút
              const actionButtons = row.querySelector('.action-buttons');
              actionButtons.innerHTML = '<button class="btn-action btn-view" data-modal="profile-modal"><i class="fas fa-eye"></i></button>';
              
              // Thêm lại event listener cho nút mới
              actionButtons.querySelector('.btn-view').addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                document.getElementById(modalId).classList.add('show');
              });
            }
          } else if (this.classList.contains('btn-reject')) {
            if (confirm('Bạn có chắc chắn muốn từ chối hồ sơ này?')) {
              // Thay đổi trạng thái hàng thành "từ chối"
              const row = this.closest('tr');
              const statusCell = row.querySelector('.status-badge');
              statusCell.className = 'status-badge status-rejected';
              statusCell.textContent = 'Từ chối';
              
              // Cập nhật nút
              const actionButtons = row.querySelector('.action-buttons');
              actionButtons.innerHTML = '<button class="btn-action btn-view" data-modal="profile-modal"><i class="fas fa-eye"></i></button>';
              
              // Thêm lại event listener cho nút mới
              actionButtons.querySelector('.btn-view').addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                document.getElementById(modalId).classList.add('show');
              });
            }
          }
        });
      });
      
      // Xử lý bộ lọc
      document.querySelector('.filters-section button').addEventListener('click', function() {
        alert('Đã áp dụng bộ lọc!');
        // Trong trường hợp thực tế, ở đây sẽ gọi API để lọc dữ liệu
      });
      
      // Xử lý phân trang
      document.querySelectorAll('.pagination button').forEach(button => {
        button.addEventListener('click', function() {
          document.querySelectorAll('.pagination button').forEach(btn => {
            btn.classList.remove('active');
          });
          if (!this.classList.contains('fa-angle-double-left') && 
              !this.classList.contains('fa-angle-left') &&
              !this.classList.contains('fa-angle-right') &&
              !this.classList.contains('fa-angle-double-right')) {
            this.classList.add('active');
          }
          // Trong trường hợp thực tế, ở đây sẽ gọi API để lấy dữ liệu trang mới
        });
      });
    }
    // 2. Mở modal "Quên mật khẩu"
    const forgotLink = document.getElementById('forgot-password');
    if (forgotLink) {
      forgotLink.addEventListener('click', e => {
        e.preventDefault();
        // Hiển thị modal quên mật khẩu
        document.getElementById('password-reset-modal').classList.add('show');
      });
    }
    
    // Mở modal đăng nhập
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
      loginLink.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('login-modal').classList.add('show');
      });
    }
  
    // 3. Mở modal xem chi tiết (dùng data-modal)
    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const modalId = btn.dataset.modal;
        document.getElementById(modalId).classList.add('show');
      });
    });    // 4. Đóng tất cả modal - Cải tiến với xử lý lỗi
    document.querySelectorAll('.close-modal, .modal .fa-times').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = closeBtn.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
          e.stopPropagation(); // Ngăn sự kiện lan truyền
        } else {
          // Nếu không tìm thấy modal parent, đóng tất cả các modal đang mở
          document.querySelectorAll('.modal.show').forEach(openModal => {
            openModal.classList.remove('show');
          });
        }
        // Đảm bảo sự kiện không lan truyền
        return false;
      });
    });
    
    // Thêm xử lý riêng cho icon đóng (dấu X) trong modal
    document.querySelectorAll('.modal .fa-times').forEach(closeIcon => {
      closeIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modal = closeIcon.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
        }
        return false;
      });
    });
    
    // 4c. Đóng modal khi nhấn ra ngoài modal - Cải tiến
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        // Chỉ đóng khi click vào phần nền bên ngoài modal-content
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });
    
    // 4d. Đóng modal khi nhấn phím ESC - Cải tiến
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Đóng tất cả các modal đang hiển thị
        document.querySelectorAll('.modal.show').forEach(modal => {
          modal.classList.remove('show');
        });
      }
    });
    
    // 4e. Đảm bảo tất cả các nút đóng trong modal đều hoạt động
    document.querySelectorAll('.modal button.close-modal').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = button.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
        }
      });
    });
  
    // 5. Validation chung cho form có class .validate-form
    document.querySelectorAll('form.validate-form').forEach(form => {
      form.addEventListener('submit', e => {
        let valid = true;
        const inputs = form.querySelectorAll('[required]');
        inputs.forEach(input => {
          // Bắt buộc nhập
          if (!input.value.trim()) {
            valid = false;
            alert(`Vui lòng nhập trường "${input.previousElementSibling.innerText}"`);
          }
          // Kiểm tra email
          if (valid && input.type === 'email') {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!pattern.test(input.value)) {
              valid = false;
              alert('Vui lòng nhập email hợp lệ');
            }
          }
          // Kiểm tra mật khẩu >= 8 ký tự
          if (valid && input.type === 'password') {
            if (input.value.length < 8) {
              valid = false;
              alert('Mật khẩu phải có ít nhất 8 ký tự');
            }
          }
        });
        if (!valid) e.preventDefault();
      });
    });
  
    // 6. Hero Slideshow Auto Slide
    showSlides(); // Gọi function slideshow đã định nghĩa ở dưới
  });
  // Slideshow function
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;
  
  // Ẩn tất cả các slide
  slides.forEach(s => s.style.display = 'none');
  
  // Tăng index hoặc reset về 0 nếu đã đạt cuối
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1; }
  
  // Hiển thị slide hiện tại
  slides[slideIndex - 1].style.display = 'block';
  slides[slideIndex - 1].classList.add('fade');
  
  // Chạy slideshow sau mỗi 5 giây
  setTimeout(showSlides, 5000);
}
