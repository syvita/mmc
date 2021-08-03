import { Transaction } from '@stacks/stacks-blockchain-api-types';


const TransactionStatus = () => {

    imgFailure = "/tx-status/failure.svg"
    imgPending = "/tx-status/pending.svg"
    imgSuccess = "/tx-status/success.svg"
    
    const status = <img
    src="/tx-status"
    width="25px"
    height="25px"
    onClick={() => setOpen(!open)}
    alt="Nav Arrow Icon"
  />
    return (
        <div></div>
    )
}

export default TransactionStatus;