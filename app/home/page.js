import React from 'react';
import "./home.css"

const Home = () => {
    return (
        <div>
            <div className="home-page">
                <div className="left-home flex flex-col justify-center align-center text-center p-2">
                   <div className="home-heading text-3xl font-bold p-2 text-center">
  Quick Reliable <span className="text-red-500">Logistic</span> Solution
</div>
                    <div className="home-content p-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe asperiores ratione veritatis veniam, impedit obcaecati ut nam sapiente molestias, aspernatur nesciunt fugit quos.</div>
                    <div className="home-button p-2">
                        <button className='bg-[rgb(40,51,70)] py-2 px-5 rounded-lg text-white'>Try Now</button>
                    </div>
                </div>
                <div className="right-home">
                    <img src="./image.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Home;