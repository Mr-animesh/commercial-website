import { useEffect } from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export const ProductInfo = () => {
    const [searchParams]= useSearchParams();
    const id = searchParams.get("productId");
    const name = searchParams.get("name");
    const [product, setProduct] = useState({});
    const [order, setOrder] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`http://localhost:3000/api/v1/product/${id}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        )
        .then(res => {
            setProduct(res.data.product)
        })
    }, [])
    return <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div
                className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
            >
                <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="text-3xl font-bold text-center">{name.toUpperCase()}</h2>
                </div>
                <div className="p-6">
                    {product.categoryName}
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                    </div>
                    <h3 className="text-2xl font-semibold">{product.price}</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        {product.stock}
                    </div>
                    <button onClick={async()=>{const response = await axios.post(`http://localhost:3000/api/v1/order/place/${id}`,{
                            headers: {
                                Authorization: "Bearer "+ localStorage.getItem("token")
                            }
                        });
                        setOrder(response.data.order)
                        localStorage.setItem("orderId", order._id)
                    }} className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                        Purchase
                    </button>
                </div>
                {order.userId}
                </div>
        </div>
      </div>
    </div>
}