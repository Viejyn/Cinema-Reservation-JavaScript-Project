/*
1- Tıklanılan koltuğun rengini değiştir ve tekrar tıklanınca tersine çevir
   -- Önce container divine eriş
   -- Bu div'e olay dinleyicisi ekle
   -- tıklanılan elemanı tespit et
   -- tespit ettiğin elemanın classında seat varsa onun class listine
   selected ekle
   -- eğer selected class'ı varsa çıkar (Yani toggle yap)

2- Eğer seçili koltuk yoksa info yazısı kalkacak, varsa gelecek
   -- info yazısına eriş
   -- sonra seçili koltuk olup/olmadığını kontrol et
   -- varsa text'in display'ini değiştir

3- Seçili koltuk sayısını ve toplam tutarı bilgi yazısında gösterme
   -- seçili koltuk sayısını aktarmak için count classlı div'i çek
   -- bu div'in innerText ine selectedSeatsCount ver
   -- film seçme kısmını filmlerin fiyat bilgisi için çek
   -- ve toplam sayı ile bu değeri çarp
   -- amount classlı span e ekle


*/

// Tıklanılan koltuğun tespiti için container divi çağırma
const container = document.querySelector(".container");
const infoText = document.querySelector(".infoText");
const select = document.getElementById("movie");
const count = document.querySelector("#count");
const amount = document.querySelector("#amount");
const seats = container.querySelectorAll(".seat:not(.reserved)");

// Veri Tabanında veri okuma

const getSeatsFromDatabase = () => {
    const dbSelectSeats = JSON.parse(localStorage.getItem('selectedSeatIndex'));
    const dbSelectedMovie =  JSON.parse(localStorage.getItem('selectedMovie'));

    select.selectedIndex = dbSelectedMovie;
    
    if(dbSelectSeats !== null && dbSelectSeats.length>0) {

        seats.forEach((seat,index) => {
            if(dbSelectSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        })
    }
}

// Veri Tabanına Kayıt Etme (Local Storage)

const saveSeatsToDatabase = (index) => {
    localStorage.setItem('selectedSeatIndex', JSON.stringify(index));
    localStorage.setItem('selectedMovie', JSON.stringify(select.selectedIndex));
}

getSeatsFromDatabase();

// Tutar Hesaplama Fonksiyonu
const priceCalculator=() => {
   //===== Koltukların Sıra Numarası Tespit İşlemleri =====//  

    // Tüm koltukları dizi haline getirme
    const seatsArray = []; 
    seats.forEach((seat) => {
        seatsArray.push(seat)
    });
    const selectedSeats = container.querySelectorAll(".seat.selected");
    const selectedSeatsArray = [];

    selectedSeats.forEach((selectedSeat) => {
        selectedSeatsArray.push(selectedSeat);
    })

    let selectedSeatIndex = selectedSeatsArray.map((selectedSeat) => {
        return seatsArray.indexOf(selectedSeat)
    })



   //===== Hesaplama İşlemleri =====// 

    // Toplam seçili koltuk sayısını bulma
    const selectedSeatsCount = container.querySelectorAll(".seat.selected").length

    const moviePrice = select.value;

    // Seçili koltuk varsa sorgusu
    if(selectedSeatsCount > 0) {
        // Eğer varsa text'in stil özelliğini değiştirme
        infoText.style.display = "block";
    } else {
        infoText.style.display = "none";
    }

    // Toplam seçili koltuk sayısını html gönderme
    count.innerText = selectedSeatsCount;
    // Toplam tutarı html gönderme
    amount.innerText = moviePrice*selectedSeatsCount;

    saveSeatsToDatabase(selectedSeatIndex)
};

priceCalculator();

container.addEventListener("click", (pointerEvent) => {

    // tıklanılan elementlerden koltuğu tespit etme
    const clickedSeat = pointerEvent.target.offsetParent;

    if (clickedSeat.classList.contains("seat") && !clickedSeat.classList.contains("reserved")) {
        clickedSeat.classList.toggle("selected");
    }

    priceCalculator();
});


select.addEventListener("change", () => {
    priceCalculator();
})