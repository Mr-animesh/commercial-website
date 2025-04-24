export const Home = () => {
    const [productName, setProductName] = useState("")
    const [categoryName, setCategoryName] = useState("")
    const [price, setPrice] = useState(0)
    const [stock, setStock] = useState("")
    const [booked ,setBooked] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/product/bulk",{
            headers: {
                Authorization: "Bearer" + localStorage.getItem("token")
            }
        })
    }).then(res => {
        setProductName(res.data.productName)
        setCategoryName(res.data.categoryName)
        setPrice(res.data.price)
        setStock(res.data.stock)
        setBooked(res.data.booked)
    }, [])
    return <div>
        <div className="flex flex-col justify-center">
            <div className=""><Appbar /></div>
            <div className="pt-4 flex justify-center"><Product value={productName}/></div>
            <div className="pt-10"><Products /></div>
        </div>
    </div>
}