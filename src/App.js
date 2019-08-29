import React, { useEffect, useState } from 'react';
import * as moment from 'moment'
import './App.css';

function App() {

  let FB = null;

  const [filter, setFilter] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadFbLoginApi()
  })

  const loadFbLoginApi = () => {
    FB = window.FB;
  }

  const getAllPosts = async (until, count) => {
    return new Promise((resolve, reject) => {
      if (count > 10) {
        resolve(null);
      }
      let edge = `/me/posts?limit=100`
      console.log(edge)
      if (until) {
        edge += `&until=${until}`
      }
      FB.api(edge, (res) => {
        console.log(res);
        resolve(res)

        //"https://graph.facebook.com/v4.0/10162454210590045/posts?since=1566704379&access_token=EAAHEau4lQmUBAED6WyFlhgiPNZBzaZAZBeO3BMnqTyj6RZCNiEZAUjcyU1PcoF40NBQneJ7jDjrPmiy92BS6Rjcf1G3HUkSRcqscaGFqgiGWvwj7n0K8XfdPJcrElP6BnZCXfzz6vv8CZB1iq54MH2ZAos2RwZALtdqRaktUQZCyeNsgDqzHbkGgNgjrEQYZBH9YQwZD&limit=25&__paging_token=enc_AdBijWdzzvr65O38qWOUF9OZCT270JXMdTntOXiPDTefXN88yE31lLS0jyOIgtYkjKeHPbdfpxyWvcLGbvGK3j618&__previous=1"
        if (res.paging.next) {
          const params = res.paging.next.replace(/.*\?/g, '').split('&')
          const map = {}
          params.forEach(p => {
            const tokens = p.split('=')
            map[tokens[0]] = tokens[1]
          })
          console.log(map);
          getAllPosts(map.until, count++)
        }
        const msgs = res.data.filter(post => post.message && post.message.match(filter));
        setPosts([...posts, ...msgs]);
      })
    });
  };


  const getMe = () => {
    FB.login(function (response) {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
          console.log('Good to see you, ' + response.name + '.');
          setPosts([])
          getAllPosts(null, 5)
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'user_posts' });
  }

  console.log(posts);

  return (
    <div className="App">
      <header className="App-header">
        <input type="text" value={filter} onChange={(evt) => { setFilter(evt.target.value) }} />
        <button onClick={getMe}>Login</button>
        {posts.map((post, index) => (<p key={post.id}>{post.created_time}: {post.message}</p>))}
      </header>
    </div>
  );
}

export default App;
