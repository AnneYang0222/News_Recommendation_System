import React from 'react';
import './NewsPanel.css';
import NewsCard from '../NewsCard/NewsCard';
import _ from 'lodash';
import Auth from '../Auth/Auth';

class NewsPanel extends React.Component {
    constructor() {
        super();
        this.state = { news:null, pageNum:1, loadedAll:false};
        //this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll() {
        const scrollY = window.scrollY
            || window.pageYOffset
            || document.documentElement.scrollYTop;
        if((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            console.log('Loading more news!');
            this.loadMoreNews();
        }
    }

    componentDidMount() {
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        window.addEventListener('scroll', () => this.handleScroll());
    }

    loadMoreNews() {
        if (this.state.loadedAll == true) {
            return;
          }
      
        const news_url = 'http://' + window.location.hostname + ':3000' +
                 '/news/userId/' + Auth.getEmail() + '/pageNum/' + this.state.pageNum;

        const request = new Request(
            news_url,
             {
                 method:'GET',
                 headers: {
                     'Authorization': 'bearer ' + Auth.getToken(),
                 }
            });
    
        fetch(request)
            .then(res => res.json())
            .then(news => {
              if (!news || news.length == 0) {
                this.setState({loadedAll:true});
              }
      
              this.setState({
                news: this.state.news ? this.state.news.concat(news) : news,
                pageNum: this.state.pageNum + 1,
            });
        });
    }

    renderNews() {
        const news_list = this.state.news.map(news => {
            return(
                <a className='list-group-item' key={news.digest} href="#">
                   <NewsCard news={news} />

                </a>

            );
        });
        return(
            <div className="container-fluid">
                <div className="list-group">
                    {news_list}
                </div>
            </div>
        );
    }

    render() {
        if (this.state.news) {
            return(
                <div>
                    {this.renderNews()}
                </div>
            );   
        } else {
            return(
                <div>
                    Loading...
                </div>
            );
        }
    }
}

export default NewsPanel;