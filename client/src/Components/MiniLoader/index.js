export default function MiniLoader( props ){

    const { custom } = props

    return(
        <div className={` border-regularWhite h-${custom.height} w-${custom.width} animate-spin rounded-full border-${custom.weight} border-t-encoredGold`}></div>
    );
}