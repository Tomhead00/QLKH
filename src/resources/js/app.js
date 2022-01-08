import React from 'react'; // nạp thư viện react
import ReactDOM from 'react-dom'; // nạp thư viện react-dom

// Tạo component App
function App() {
    return (
        <div>
            <h1>Xin chào anh em F8!</h1>
        </div>
    );
}

// Render component App vào #root element
ReactDOM.render(<App />, document.getElementById('root'));

// refesh mieu ta /n
function enterDes() {
    $('.mt').map(function (i, mt) {
        // console.log($(mt).text());
        $(mt).html($(mt).text().replace(/\n/g, '<br/>'));
    });
}
document.addEventListener('DOMContentLoaded', function () {
    //console.log("cc");
    enterDes();
});
