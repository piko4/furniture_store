"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

    // ------ user object------
    const [user, setUser] = useState(null);


    //-------------------- redirection to home page if user session is unavailable ----------------------
    const router = useRouter();
    const { data: session, status } = useSession(); // status can be "loading", "authenticated", or "unauthenticated"

    useEffect(() => {
        // Only redirect when both session and user state have finished loading
        if (user === null && session === undefined) {
            router.replace("/"); // Use replace to avoid pushing redirect into history
        }
    }, [status, user, session, router]);


    //   ----------------------------------get user from server session and get wishlist products-----------------------------

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // This function fetches the user and then fetches product details in bulk
    const fetchWishlistProducts = async () => {
        try {
            // Fetch the user from your backend (which includes the wishlist)
            const userResponse = await axios.get(
                "http://localhost:8070/ACCOUNT-SERVICE/api/user/user",
                { withCredentials: true }
            );
            console.log("Fetched user:", userResponse.data);
            setUser(userResponse.data);

            // If the wishlist exists and has product IDs, fetch products
            if (
                userResponse.data.wishlist &&
                Array.isArray(userResponse.data.wishlist.productIds) &&
                userResponse.data.wishlist.productIds.length > 0
            ) {
                const ids = userResponse.data.wishlist.productIds.join(",");
                const productsResponse = await axios.get(
                    "http://localhost:8070/PRODUCT-SERVICE/api/product",
                    { params: { ids } }
                );
                setProducts(productsResponse.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching wishlist products:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch wishlist products when the page mounts.
    useEffect(() => {
        fetchWishlistProducts();
    }, []);

    // ---------------------------------------remove product from wishlist------------------------------
    const removeFromWishlist = async (userId, productId) => {
        try {
            await axios.post("http://localhost:8070/ACCOUNT-SERVICE/api/wishlist/remove", null, {
                params: { userId, productId },
                withCredentials: true,
            });
            alert("Product removed from wishlist!");

            // Update the products state by filtering out the removed product
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));

            // fetchWishlistProducts();
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
        }
    };


    // ---------------------------------------  
    return (<>
        <div className="min-h-screen dark:bg-gray-900">


            <h2 className="text-2xl font-bold text-gray-200 bg-gray-800 p-4 rounded-lg shadow-md">
                ⭐ My Wishlist
            </h2>
<br />
            {loading ? (
                <p>Loading wishlist...</p>
            ) : products.length === 0 ? (
                <p>No items in wishlist.</p>
            ) : (
                <ul>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <>
                                {/* -------prduct card------ */}
                                <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                    <a href="#">
                                        <img class="p-8 rounded-t-lg" src={product.imageURL} alt="product image" />
                                    </a>
                                    <div class="px-5 pb-5">
                                        <a href="#">
                                            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                                        </a>
                                        <div class="flex items-center mt-2.5 mb-5">
                                            <div class="flex items-center space-x-1 rtl:space-x-reverse">
                                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg class="w-4 h-4 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                            </div>
                                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">5.0</span>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span class="text-2xl font-bold text-gray-900 dark:text-white"> {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                                minimumFractionDigits: 0,
                                            }).format(product.price)}</span>

                                            <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>
                                            <button onClick={() => removeFromWishlist(user.id, product.id)} type="button" className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500">
                                                <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            </>
                        ))}
                    </div>
                </ul>
            )}




        </div>



    </>
    )
}

export default page
