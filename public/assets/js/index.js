window.onload = () => {
    var btn_show = document.querySelector('.button-show');
    console.log(btn_show)
    btn_show.addEventListener('click', () => {
      var show_data = document.querySelector('.lookat')
      show_data.classList.toggle('show-menu')
    })
    // Làm phần bank
    var bxs_bank = document.querySelectorAll('.bxs-bank_btn');
    for(let i = 0 ; i < bxs_bank.length ;i++){
      bxs_bank[i].addEventListener('click', () => {
      document.getElementsByClassName('image_bank')[0].innerHTML = ""
      var show_data = document.querySelector('.bank')
      show_data.classList.toggle('show_bank')
      removeMenu()
    })
    }
    // Làm phần bank
    var close_bank = document.querySelector('.close-bank-a');
    close_bank.addEventListener('click', () => {
      var show_data = document.querySelector('.bank')
      show_data.classList.toggle('show_bank')
      
    })
    var create_qr = document.querySelector('.create_qr');
    create_qr.addEventListener('click', () => {
      var money = document.querySelector('#bank_money')
      var bank_infoadd = document.querySelector('.bank_infoadd')
      var img = document.createElement('img')
      img.width = 300
      img.src = `https://img.vietqr.io/image/vietinbank-108867592530-compact2.jpg?amount=${money.value}&addInfo=${bank_infoadd.textContent}`
      document.getElementsByClassName('image_bank')[0].innerHTML = ""
      document.getElementsByClassName('image_bank')[0].appendChild(img)
      var p = document.createElement('p')
      const formattedNumber = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(money.value);
      console.log(formattedNumber)
      p.innerHTML = `<span> Chuyển khoản: <span style='color: blue;'>${formattedNumber}</span>. Nội dung: <span style='color: blue;'>${bank_infoadd.textContent}</span></span>`
      document.getElementsByClassName('image_bank')[0].appendChild(p)
      // 
      document.querySelector('.transaction_note').textContent = " Giao dịch sẽ được xử lý sau ít phút!";

    })
    // Hàm chuyển đổi vùng
    const dereactRouter = (router) => {
        var routs = document.querySelectorAll('.router')
        var main = document.querySelector('.main')
        var cicchecker = document.querySelector('.cicchecker')
        for(let i = 0 ; i < routs.length ;i++){
          routs[i].classList.remove('shows_creen')
        }
        if(router == "cic_checker"){
          cicchecker.classList.add('shows_creen')
        }
        removeMenu()
    }
    const removeMenu = () =>{
        var show_data = document.querySelector('.lookat')
        show_data.classList.remove('show-menu')
        
    }
    var cic_checkers = document.querySelectorAll('.cic_checker');
    for(let i = 0 ; i < cic_checkers.length ;i++){
      cic_checkers[i].addEventListener('click', () => {
        dereactRouter('cic_checker')
      })
    }
    // Phần đăng xuất
    var logout = document.querySelector('.logout') 
    logout.addEventListener('click',()=>{
      localStorage.removeItem("user")
      location.reload()
    })
    // Kiểm tra đăng nhập
  
  }