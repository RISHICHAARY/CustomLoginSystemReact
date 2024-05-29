export default function Loader( props ){

    const { custom } = props

    return(
        <div className='flex flex-col gap-10 justify-center items-center h-screen bg-encoredBlack'>
            <div className={`border-encoredGrey h-${custom.height} w-${custom.width} animate-spin rounded-full border-${custom.weight} border-t-encoredGold`}></div>
            <p className='font-montserrat text-2xl text-center text-regularWhite'>Loading</p>
        </div>
    );
}