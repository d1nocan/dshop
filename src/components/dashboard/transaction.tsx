

type Props = {
    id: string | null;
    status: string | null;
    points: number;
}

const Transaction = ({id, status, points} : Props) => {
    return (<>
    <div className="xl:w-8/12 w-11/12 mx-auto flex flex-wrap items-center justify-between px-8 mb-2 xl:mb-0 lg:mb-0 border-b border-gray-300 dark:border-gray-700">
        <div className="xl:w-1/5 py-3 xl:py-5">
          <div className="flex items-center gap-4">
            <p className="text-lg text-gray-800 dark:text-gray-100 pl-2 font-normal">
              {id}
            </p>
          </div>
        </div>
        <div className="xl:w-1/5 py-3 xl:py-5">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 pl-2 font-normal">
              Status: {status}
            </p>
          </div>
        </div>
        <div className="xl:w-1/5 py-3 xl:py-5">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 pl-2 font-normal">
              Points: {points}
            </p>
          </div>
        </div>
      </div>
    </>)
}


export default Transaction