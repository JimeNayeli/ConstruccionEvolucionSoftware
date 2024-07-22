import React from "react"
import style from "../styles/Footer.module.scss"

const Footer = () => {
  return (
    <div id="footer" className={style.footer}>
      <div className={style.footerText}>
        <p>
          Copyright © 2023 Yet Another Auction App
        </p>
        <p>|</p>
        <p>
          Made with ❤️ by <a target={"_blank"} href="https://shubhamdhingra38.github.io/" >Shubham</a>
        </p>
      </div>

    </div>
  )
}

export default Footer
