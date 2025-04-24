import { useEffect, useState} from "react"
import { Button } from "./Button"
import axios from "axios";
import {useNavigate} from  "react-router-dom"
export const Products =() => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("");
    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/product/bulk?filter=" + filter , {
            headers: {
                Authorization: "Bearer" + localStorage.getItem("token")
            }
        })
        .then(res => {
            setProducts(res.data.product)
        })
    }, [filter])

    return <>
        <div className="font-bold mt-6 text-lg">
            Products
        </div>
        <div className="my-2">
            <input onChange={(e)=>{setFilter(e.target.value)}} type="text" placeholder="Search Product..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {products.map(product => <Product product={product} />)}
        </div>
    </>
}

function Product({product}) {
    const navigate = useNavigate();
    return <div className="flex justify-center">
        <div className="flex">
            <div className="">
                <div className="">
                    {product.productName}
                </div>
                <div>
                    {product.categoryName}
                </div>
            </div>
            <div className="">
                <div>
                    {product.price}
                    {product.stock}
                </div>
                {product.booked}
            </div>
        </div>
        <div className="">
            <Button onPress={(e)=> {
                navigate("/place?productId=" + product._id + "&name="+ product.productName)
            }} label={"Buy Product"} />
        </div>
    </div>
}