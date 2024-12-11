import styles from './Header.module.css'
// import { FaSearch } from "react-icons/fa";
import { FaShoppingBasket } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

import Drawer from '@mui/material/Drawer';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

let vertical = 'top';
let horizontal = 'left';

export default function Header(){

  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [removeItem, setRemoveItem] = useState('');

  const navigate = useNavigate();


  

  function handleClose(){
    setOpen(false);
  }

  function handleRemove(item){
    let newItems = [...cartItems];
    newItems = newItems.filter((cItem)=>{
        return cItem != item
    })
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    setOpen(true);
    setRemoveItem(item.title)
  }

  function handleAddClick(item){
    let newItems = [...cartItems];
    newItems = newItems.map((itemC)=>{
      if(itemC.id == item.id){
        return {...itemC, count: itemC.count + 1}
      }
      return itemC;
    })
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    setCartItems(newItems);
  }
  function handleSubtractClick(item){
    if(item.count >1){
      let newItems = [...cartItems];
      newItems = newItems.map((itemC)=>{
        if(itemC.id == item.id){
          return {...itemC, count: itemC.count - 1}
        }
        return itemC;
      })
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      setCartItems(newItems);
    }
  }

  function handleSubmit(){
    setCartItems([]);
    setOpen(true);
    localStorage.setItem("cartItems", JSON.stringify([]));
    setRemoveItem(`Order of total $${(Math.round(cartItems.reduce((accumulator ,item) => {return accumulator += (item.count * item.price);}, 0))*100)/100} Confirmed. All items`)
  }

  const listItems = cartItems.map(item =>
    <li key = {item.id} >
       <div className={styles.cartCard}>
          <div className={styles.title}>{item.title}</div>
          <Link state={{ from: item }} style = {{textAlign : 'center'}} to = '/description'><img  src = {item.image}></img></Link>
          <div className={styles.box}>
            <div className={styles.counter}>
              <button className={styles.minus} onClick ={()=>handleSubtractClick(item)}>-</button>
              <div className={styles.count}>{item.count}</div>
              <button className={styles.add} onClick ={()=>handleAddClick(item)}>+</button>
            </div>
            <button onClick = {()=>handleRemove(item)} className={styles.remove}>Remove from cart</button>
            <div className={styles.price}>${item.price}</div>
          </div>
       </div>
    </li>
  );
  
  console.log(searchValue);
  console.log(data)
  let foundValue = data.filter((item)=>{
     return item.title == searchValue;
  })

  console.log(foundValue[0])

  function handleOptionsSelect(newValue){
    let foundValue = data.filter((item)=>{
      return item.title == newValue;
    })
    if(foundValue.length > 0){
      navigate(`/description`, { state: { from: foundValue[0]} });
    }
    
  }
  useEffect(() => {
    // fetch data
    
    const dataFetch = async () => {
      const data = await (
        await fetch(
          'https://fakestoreapi.com/products',
        )
      ).json();

      // set state when the data received
      setData(data);
    };
    if(JSON.parse(localStorage.getItem("cartItems")) != null){
      setCartItems(JSON.parse(localStorage.getItem("cartItems")));
    }
    if(JSON.parse(localStorage.getItem("data")) != null){
      setData(JSON.parse(localStorage.getItem("data")));
    }
    else{
      dataFetch();
    }
    
    }, []);

  const flatProps = {
    options: data.map((option) => option.title),
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
      if (
          event.type === "keydown" &&
          (event.key === "Tab" || event.key === "Shift")
      ) {
          return;
      }
      setIsOpen(open);
    };
  
    const noOfProducts = useMemo(()=>{
        return cartItems.reduce((accumulator ,item) => {return accumulator += item.count;}, 0)
    }, [cartItems])

    const totalPrice = useMemo(()=>{
        return (Math.round(cartItems.reduce((accumulator ,item) => {return accumulator += (item.count * item.price);}, 0))*100)/100
    }, [cartItems])

    return(
      <>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <Link to = "/" className={styles.navTitle}>shopMart</Link>
            <div className={styles.navMid}>
              <Link to = "/" className={styles.homeButton}>Home</Link>
              <Link to = "/shop" className={styles.shopButton} >Shop</Link>
            </div>
            <div className={styles.navEnd}>
              {/* <button className={styles.searchButton}><FaSearch /></button> */}
              {data == [] ? '' : 

                    <Autocomplete
                        value={searchValue}
                        onChange={(event, newValue) => {
                          setSearchValue(newValue);
                          handleOptionsSelect(newValue);
                        }}
                        {...flatProps}
                        sx={{ width: 300, color: 'white', backgroundColor: '#b9c0ff', paddingLeft: '0.15rem', borderRadius: '0.2rem' }}
                        disablePortal
                        renderInput={(params) => (
                          <TextField {...params} label="Search Item" variant="standard" />
                        )}
                    />
          
              }
              
              <button onClick={toggleDrawer(true)} className={styles.basketButton}>
                <FaShoppingBasket />
                <div>({cartItems.reduce((accumulator ,item) => {return accumulator += item.count;}, 0)})</div>
              </button>
            </div>
          </div>
        </div>
        <Drawer
                anchor="right" // Slide-in from the right
                open={isOpen}
                onClose={toggleDrawer(false)}
            >
                {/* Content inside the drawer */}
              <div className={styles.drawer}>
                <div className={styles.header}>Your Cart ({noOfProducts})</div>
                <hr></hr>
                {cartItems.length > 0 ? 
                <ul style={{listStyle: 'none'}}>
                  {listItems}
                  <button onClick={handleSubmit} className={styles.checkout}>Checkout Total ${totalPrice}</button>
                </ul> 
                
                  : <div className={styles.empty}>Cart is empty. Start by adding items to the cart!</div>}
              </div>
        </Drawer>
        <Snackbar anchorOrigin={{ vertical , horizontal }} open={open} autoHideDuration={1850} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{ width: '100%' }}
                        >
                        {removeItem} removed from cart!
                    </Alert>
        </Snackbar>
        < Outlet context={[cartItems, setCartItems]}/>
      </>
    )
}
