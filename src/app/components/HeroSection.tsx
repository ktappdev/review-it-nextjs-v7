import Image from "next/image";

const HeroSection = () => {
  return (
    <section className=" relative h-[400px]  md:h-[400px] lg:h-[500px] w-full">
      <Image
        src="https://res.cloudinary.com/dhglzlaqf/image/upload/v1680311568/book_y8ekbr.png"
        alt="Background Image"
        fill
        className="fixed inset-0 object-cover object-center"
        style={{ objectFit: "cover" }}
        quality={75}
        priority
      />
      <div className=" flex  justify-center items-center absolute top-0 left-0 right-0 bottom-0 text-center text-white bg-opacity-50 bg-myTheme-neutral">
        <div className="flex flex-1 justify-center flex-col">
          <h1 className=" mt-28 text-4xl font-black text-myTheme-neutral">
            Welcome
          </h1>
          <div className=" flex flex-1 justify-center ">
            <div className="flex flex-col h-[300px] sm:h-[400px] w-11/12 sm:w-7/12">
              <p className="text-xl mt-1 font-normal pb-1 text-myTheme-light">
                Review It is a website where you can share and read reviews on
                anything.
              </p>
              <p className="text-xl mt-0 font-normal pb-4 text-myTheme-light">
                It is easy, fun, and free to use.
              </p>
              <div className=" flex flex-1 flex-col justify-end mb-60">
                <div className=" flex sm:flex-row  flex-col w-full ">
                  <form className="flex flex-1 justify-center w-full">
                    <label
                      htmlFor="default-search"
                      className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                      Search
                    </label>
                    <div className="relative w-full">
                      <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-myTheme-neutral focus:border-myTheme-light dark:bg-myTheme-neutral dark:border-myTheme-grey-600 dark:placeholder-myTheme-light dark:text-myTheme-light dark:focus:ring-myTheme-secondary dark:focus:border-myTheme-light"
                        placeholder="Company | Service | Product..."
                        required
                      />
                      <button
                        type="submit"
                        className=" dark:text-white  absolute right-2.5 bottom-2.5 bg-myTheme-primary hover:bg-myTheme-accent focus:ring-4 focus:outline-none focus:ring-myTheme-secondary font-medium rounded-lg text-sm px-4 py-2  dark:hover:bg-myTheme-accent dark:focus:ring-myTheme-secondary"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
