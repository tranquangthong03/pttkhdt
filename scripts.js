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
