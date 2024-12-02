document.addEventListener("DOMContentLoaded", () => {
    const gonderBtn = document.getElementById('gonderBtn');
    const soruInput = document.getElementById('soru');
    const cevapDiv = document.getElementById('cevap');

    gonderBtn.addEventListener('click', () => {
        const soru = soruInput.value.trim();
        if (soru) {
            // Kullanıcı sorusunu ekrana yaz
            cevapDiv.innerHTML += `<p><strong>Soru:</strong> ${soru}</p>`;
            soruInput.value = '';

            // Sunucuya POST isteği gönder
            fetch('http://localhost:8000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: soru }),
            })
            .then(response => response.json())
            .then(data => {
                // Sunucudan gelen cevabı ekrana yaz
                cevapDiv.innerHTML += `<p><strong>Cevap:</strong> ${data.response}</p>`;
                cevapDiv.scrollTop = cevapDiv.scrollHeight;
            })
            .catch((error) => {
                console.error('Error:', error);
                cevapDiv.innerHTML += `<p><strong>Hata:</strong> Bir hata oluştu, lütfen tekrar deneyin.</p>`;
            });
        } else {
            cevapDiv.innerHTML += "<p>Lütfen bir soru girin.</p>";
        }
    });

    soruInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            gonderBtn.click();
        }
    });
});

function scrollToPage(pageId) {
    const page = document.getElementById(pageId);
    page.scrollIntoView({ behavior: 'smooth' });
}

function openModal(title) {
    var modalContent = "";
    if (title === "Sık Sorulan Sorular") {
        modalContent = "<h2>" + title + "</h2><p>ChatBot ile amaç üniversite öğrencilerinin bilgiye erişimini kolaylaştırmak ve üniversite yönetiminin iş yükünü azaltmaktır. Öğrencilerin sıkça sorduğu sorulara hızlı ve doğru yanıtlar verebilen bir chatbot geliştirilmiştir. Önemi, öğrencilerin zaman tasarrufu sağlaması ve üniversite bilgi sistemlerinin etkinliğini artırmasıdır. Bu chatbot sayesinde, öğrenciler ders kayıtları, harç ücretleri, akademik takvim gibi konularda hızlıca bilgi alabilirler.</p>";
    } else if (title === "Aklınızda Kalanlar") {
        modalContent = "<h2>" + title + "</h2><p>Chatbot ile ilgili herhangi bir sorunuz varsa, çekinmeden sorunuzu sorun. Chatbot, sizin sorularınızı yanıtlamak için burada!</p>";
    } else if (title === "Merak Ettikleriniz") {
        modalContent = "<h2>" + title + "</h2><p>Öğrenim Ücretimi bulunduğum şehirden yatırabilirmiyim?, E-Devlet üzerinden kayıt yaptırdım evraklarımı ne zaman ve nasıl teslim edeceğim? ve benzeri soruları sorup anında cevap alabilirsiniz.</p>";
    }

    var modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    modal.addEventListener('click', function () {
        modal.remove();
    });
}
