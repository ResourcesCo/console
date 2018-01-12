import Link from 'next/link'

export default () => (
  <div className="sign-in">
    <form className="sign-in-form" action="/sign-in" method="POST">
      <input ref={el => el.focus()} name="password" type="password" placeholder="ACCESS CODE" />
      <input type="submit" value="ENTER" />
    </form>

    <style jsx>{`
      .sign-in {
        width: 100%;
      }
      .sign-in-form {
        margin: 100px auto 0;
        width: 30%;
      }
      .sign-in-form input {
        width: 100%;
        display: block;
        box-sizing: border-box;
        margin: 5px 0;
        padding: 5px;
      }
      .sign-in-form input[type=submit] {
        background-color: #222;
        color: #ddd;
        border: 1px solid #aaa;
      }
    `}</style>
  </div>
)
