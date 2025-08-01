import { useNavigate } from "react-router-dom";
import NotFound from "./notFound";
import CartIsEmptyImage from "../../assets/media/icons/CartIsEmpty.svg";

const CartIsEmptyPage = () => {
      const navigate = useNavigate();
    
  return (
    <NotFound
      title="Cart is Empty"
      message="Keep calm and search again. We have so many other product that you will like!"
      imageSrc={CartIsEmptyImage}
      buttonText="Shop Now"
      onButtonClick={() => navigate('/products')}
    />
  );
};


export default CartIsEmptyPage; 
