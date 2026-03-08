// مصفوفة لتخزين بيانات المحاكاة
let simulationData = [];

// تحميل أي بيانات سابقة من localStorage
if (localStorage.getItem('phishingSimulationData')) {
    simulationData = JSON.parse(localStorage.getItem('phishingSimulationData'));
}

// إدارة القائمة النشطة
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل الروابط في شريط التنقل
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // معالجة نموذج المحاكاة التعليمية
    const demoForm = document.getElementById('phishing-demo-form');
    const demoExplanation = document.getElementById('demo-explanation');
    
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على البيانات المدخلة
            const email = document.getElementById('demo-email').value;
            const password = document.getElementById('demo-password').value;
            
            // التحقق من إدخال البيانات
            if (!email || !password) {
                alert('الرجاء إدخال بيانات للتوضيح');
                return;
            }
            
            // حفظ البيانات مع وقت التجربة
            const entry = {
                id: Date.now(),
                email: email,
                password: password,
                timestamp: new Date().toLocaleString('ar-SA'),
                date: new Date().toISOString()
            };
            
            // إضافة للقائمة
            simulationData.push(entry);
            
            // حفظ في localStorage
            localStorage.setItem('phishingSimulationData', JSON.stringify(simulationData));
            
            // عرض البيانات المسروقة في المحاكاة
            document.getElementById('stolen-email').textContent = email;
            document.getElementById('stolen-password').textContent = '*'.repeat(password.length);
            
            // إظهار شرح المحاكاة
            demoExplanation.style.display = 'block';
            
            // تمرير سلس للشرح
            demoExplanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // إظهار رسالة توعوية
            showNotification('✅ تم تسجيل بيانات المحاكاة للأغراض التعليمية', 'success');
            
            // تفعيل تأثير وامض للبيانات المسروقة
            const stolenDataDiv = document.querySelector('.stolen-data');
            stolenDataDiv.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                stolenDataDiv.style.animation = '';
            }, 500);
        });
    }

    // إضافة تأثيرات حركية للبطاقات عند التمرير
    const cards = document.querySelectorAll('.stat-card, .protection-card, .step-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // إضافة إحصائيات متحركة
    animateStats();
});

// دالة لتحريك الإحصائيات
function animateStats() {
    const stats = document.querySelectorAll('.stat-card h3');
    stats.forEach(stat => {
        const value = stat.textContent;
        if (value.includes('مليار')) {
            animateNumber(stat, 3.4, 'مليار');
        } else if (value.includes('%')) {
            animateNumber(stat, 97, '%');
        } else if (value.includes('$')) {
            animateNumber(stat, 17700, '$');
        }
    });
}

function animateNumber(element, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (suffix === '$') {
            element.textContent = '$' + Math.round(current).toLocaleString();
        } else if (suffix === '%') {
            element.textContent = Math.round(current) + '%';
        } else {
            element.textContent = current.toFixed(1) + ' ' + suffix;
        }
    }, 20);
}

// دالة لعرض الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'warning' ? '#ecc94b' : '#48bb78'};
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideDown 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// إضافة أنماط CSS إضافية
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); background: #fed7d7; }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;

document.head.appendChild(style);

// إضافة زر للعودة للأعلى
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    z-index: 999;
`;

scrollTopBtn.onmouseover = () => {
    scrollTopBtn.style.transform = 'translateY(-5px)';
};

scrollTopBtn.onmouseout = () => {
    scrollTopBtn.style.transform = 'translateY(0)';
};

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});