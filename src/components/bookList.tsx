import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useRouteError } from "react-router-dom";
import Loader from "./loader";
import Api from "../libs/api";
import imgProj from "../assets/img/imgProj";
import { Book } from "../utils/type";
import Pagination from "react-js-pagination";
import PdfViewer from "./pdfviewer";
import { userInfo } from "os";

function BooksList() {
  const [books, setBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPdf, setSelectedPdf]=useState();
  const token = localStorage.getItem("token");
  const userRole =localStorage.getItem("role");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await Api.get("books");
      setBook(response.data);
      setLoading(false);
      console.log(response);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des mémoires", error);
      setLoading(false);
    }
    
  };

  useEffect(() => {
    console.log(userRole);
    console.log(token);
    
    if (books.length > 0) {
      setIsEmpty(false);
    }
    fetchBooks();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      await Api.deleteItem(`books/${bookId}`);
      setBook(books.filter((book:any) => book.id !== bookId));
    } catch (error) {
      console.error("Erreur lors de la suppression du mémoire", error);
    }
  };

  return (
    <>
      <div className="flex-1 z-0">{loading && <Loader />}</div>
      <div className="flex flex-row gap-4 w-full mx-auto mt-8">
        {!loading && (
          <div className="bg-white px-4 pt-3 rounded-sm border-gray-200 flex-1">
            <h2 className="text-2xl font-bold mb-4">
              Liste des Mémoires Disponibles
            </h2>
            <hr />
            <div className="mt-3">
              <table className="gap-3 table-auto min-w-full border border-gray-300">
                <thead className="bg-blue-500">
                  <tr className="bg-gray-50 text-left dark:bg-meta-4">
                    <th className="min-w-[120] py-4 px-4 font-medium text-black text-sm dark:text-white xl:pl-11">
                      Titre
                    </th>
                    
                    <th className="min-w-[120] py-4 px-4 font-medium text-black text-sm dark:text-white">
                      Filière
                    </th>
                    <th className="min-w-[120] py-4 px-4 font-medium text-black text-sm dark:text-white">
                      Auteur(s)
                    </th>
                    <th className="min-w-[120] py-4 px-4 font-medium text-black text-sm dark:text-white">
                      Année
                    </th>
                    <th className="min-w-[120] py-4 px-4 font-medium text-black text-sm dark:text-white">
                      Ouvrir
                    </th>
                    {userRole === "admin" && (
                      <>
                        <th className="min-w-[120] py-4 px-4 font-medium text-black text-sm dark:text-white">
                          Actions
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 &&
                    books
                      .slice(
                        (activePage - 1) * itemsPerPage,
                        activePage * itemsPerPage
                      )
                      .map((book: any, index) => (
                        <tr key={index}>
                          <td className="border-b text-black border-[#eee] py-4 px-4 xl:pl-11 text-sm dark:border-strokedark">
                            {book.title}
                          </td>
                          
                          <td className="border-b border-[#eee] py-4 px-4 pl-p text-sm dark:border-strokedark xl:pl-11">
                            {book.filiere}
                          </td>
                          <td className="border-b border-[#eee] py-4 px-4 pl-p text-sm dark:border-strokedark xl:pl-11">
                            {book.authors.map((author:any, index: any)=>(<span key={index}>{author.noms+" "}</span>))}
                          </td>
                          <td className="border-b border-[#eee] py-4 px-4 pl-p text-sm dark:border-strokedark xl:pl-11">
                            {book.year}
                          </td>
                          <td className="border-b border-[#eee] py-4 px-4 pl-p text-sm dark:border-strokedark xl:pl-11">
                            <a href={book.pdfLink}
                              target="_blank"
                              className="text-blue-500"
                            >
                              
                              Voir le PDF
                            </a>
                          </td>
                          {userRole === "admin" && (
                            <>
                              <td className="border-b border-[#eee] py-4 px-4 pl-p text-sm dark:border-strokedark xl:pl-11">
                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="bg-red-500 text-white p-3"
                                >
                                  Supprimer
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                </tbody>
              </table>

              {userRole === "admin" && (
                <>
                  <td className="border-b border-[#eee] py-4 px-4 pl-p text-sm dark:border-strokedark xl:pl-11">
                    <Link to="/home/newbook">
                      <button className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-100  duration-300 mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Ajouter un mémoire
                      </button>
                    </Link>
                  </td>
                </>
              )}
              <div className="mt-4 flex justify-center">
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={itemsPerPage}
                  totalItemsCount={books.length}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange as any}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default BooksList;
