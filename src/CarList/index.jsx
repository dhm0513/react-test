import React, { useState, useEffect, useRef } from "react";
// import data from "./data.json";
import "./style.css";

export default function CarList() {
  const panelRef = useRef(null);
  // const list = data;
  const [list, setList] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [isShowPanel, setIsShowPanel] = useState(false);

  const debounce = (fn, delay = 500) => {
    let timer = null;
    return function () {
      let args = [...arguments];
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };
  const handleShowPanel = () => {
    setIsShowPanel(true);
  };

  const handleClickOut = (e) => {
    // if (panelRef.current && !panelRef.current.contains(e.target)) {
    //   setIsShowPanel(false);
    // }
    setIsShowPanel(!isShowPanel);
  };

  const handleSelectCar = debounce((item) => {
    const _id = item.id;
    let _selectList = [...selectList];
    const index = _selectList.findIndex((item) => item.id === _id);
    if (index > -1) {
      _selectList[index].num++;
    } else {
      _selectList.push({ ...item, num: 1 });
    }
    setSelectList(_selectList);
    alert("加购成功！");
  });
  const handleDeleteCar = (index) => {
    let _selectList = [...selectList];
    _selectList.splice(index, 1);
    setSelectList(_selectList);
  };
  useEffect(() => {
    const dataUrl = process.env.PUBLIC_URL;
    fetch(dataUrl + "/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // 在这里处理获取到的 JSON 数据
        setList(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    // document.addEventListener("mousedown", handleClickOut);
    // return () => {
    //   document.removeEventListener("mousedown", handleClickOut);
    // };
  }, []);
  return (
    <>
      <header
        className="Header"
      >
        <h3>购物天堂</h3>
        <div className="Shop-cart-box" onMouseLeave={handleClickOut}>
          <button onMouseEnter={handleShowPanel}>购物车</button>
          {isShowPanel && (
            <div className="Shop-cart-panel" ref={panelRef}>
              {selectList.length > 0 ? (
                <>
                  {selectList.map((item, index) => (
                    <div className="Good-desc" key={item.id}>
                      <span className="name">{item.title}</span>
                      <div>
                        {item.price}*{item.num}
                        <button onClick={() => handleDeleteCar(index)}>
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                  <button>购买</button>
                </>
              ) : (
                <p className="Empty-word">暂无商品</p>
              )}
            </div>
          )}
        </div>
      </header>
      <div className="Goods">
        {list.map((item) => (
          <div className="Good-item" key={item.id}>
            <img src={require(`./img/` + item.img)} alt=""></img>
            <div className="Good-desc">
              <span className="name">{item.title}</span>
              <div>
                {item.price}
                <button onClick={() => handleSelectCar(item)}>
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
