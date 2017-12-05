export default () => (
  <div className="rest-header">
    <div className="left">
      <a href="">GET</a>{" "}
      <a href="">https://api.github.com/v3/users/<em className="field">douglascrockford</em></a>{" "}
      <a href=""><span className="smaller">▼</span>json</a>{" "}
      <a href="">ua:r</a>
    </div>
    <div className="right">
      <a href="" className="button">go</a>
    </div>
    <style jsx>{`
      .rest-header .left  {
        float: left;
      }
      .rest-header .right {
        float: right;
      }
      a {
        color: #222;
        text-decoration-color: #bbb;
      }
      a.button {
        color: #999;
      }
      em.field {
        color: #999;
      }
      span.smaller {
        font-size: 50%;
      }
    `}</style>
  </div>
)
