import "./App.css";
import { Form } from "react-bootstrap";
import { useRef, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = import.meta.env.VITE_API_KEY;
const IMAGES_PER_PAGE = 18;

export default function App() {
  const searchInputVar = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSearch(event) {
    event.preventDefault();
    console.log(searchInputVar.current.value);
    setPage(1);
    fetchImages();
  }

  const handleSelection = (selection) => {
    searchInputVar.current.value = selection;
    setPage(1);
    fetchImages();
  };

  {
    /*useEffect(() => {
    const getImages = async () => {
      try {
        const result = axios.get(
          `${API_URL}?client_id=${API_KEY}&query=${searchInputVar.current.value}&page=1&per_page=${IMAGES_PER_PAGE}`,
        );
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getImages();
  }, []);*/
  }

  const fetchImages = useCallback(
    async () => {
      try {
        if(searchInputVar.current.value) {
          setErrorMessage("")
          setLoading(true)
          // destructured data
          const { data } = await axios.get(
            `${API_URL}?client_id=${API_KEY}&query=${searchInputVar.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}`,
          );
          console.log(data);
          setImages(data.results);
          setTotalPages(data.total_pages);
          setLoading(false)
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("Error fetching images, try again later.")
        setLoading(false)
      }
    }, [page]
  )

  useEffect(()=>{
    fetchImages();
  }, [fetchImages, page]) 

  return (
    <main className="container">
      <h1 className="title">Image Search</h1>
      <section className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            className="search-input"
            type="search"
            placeholder="Search..."
            ref={searchInputVar}
          />
        </Form>
      </section>
      <section className="filters">
        <section
          onClick={() => {
            handleSelection("Dogs");
          }}
        >
          Dogs
        </section>
        <section
          onClick={() => {
            handleSelection("Mountains");
          }}
        >
          Mountains
        </section>
        <section
          onClick={() => {
            handleSelection("Pets");
          }}
        >
          Pets
        </section>
        <section
          onClick={() => {
            handleSelection("Cities");
          }}
        >
          Cities
        </section>
        <section
          onClick={() => {
            handleSelection("Nature");
          }}
        >
          Nature
        </section>
      </section>
      <section className="images">
        {loading ? (<p className='loading'>Loading...</p>) : (
          images.map((image) => {
            return (
              <div key={image.id}>
                <img
                  className='image'
                  src={image.urls.small}
                  alt={image.alt_description}
                />
              </div>
            )
          })
        )}
      </section>
      <section className="buttons">
        {page > 1 && (
          <button
            onClick={() => {
              setPage(page - 1);
            }}
            className="navbtn"
          >
            Previous
          </button>
        )}
        {page < totalPages && (
          <button
            onClick={() => {
              setPage(page + 1);
            }}
            className="navbtn"
          >
            Next
          </button>
        )}
      </section>
    </main>
  );
}
