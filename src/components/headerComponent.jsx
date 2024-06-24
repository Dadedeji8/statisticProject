import React from 'react'

const Header = ({ text, style }) => {
    return (
        <h1 className={style}>
            {text}
        </h1>
    )
}

export default Header