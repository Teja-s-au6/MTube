import React, {Component} from 'react';
import { Button }from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GoogleLogout, GoogleLogin } from 'react-google-login';
import config from '../config';
import { connect } from 'react-redux';
import { logOutUser, setUser } from '../store/userReducer';
import { Switch, Route, Redirect, withRouter} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import TrendingPage from '../pages/TrendingPage';
import VideoDetail from '../pages/VideoDetail';
import SearchResultPage from '../pages/SearchResultPage';
import 'antd/dist/antd.css';
import '../styles/NavBar.css'
import { Layout, Menu, Input } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UploadOutlined,
  HomeOutlined,
  FireOutlined,
} from '@ant-design/icons';
import PlaylistPage from '../pages/PlaylistPage';
import ProfilePage from '../pages/ProfilePage';

const { Header, Sider, Content } = Layout;

const { Search } = Input;
class Navbar extends Component{

	state = {
		collapsed: false,
	  };
	
	  toggle = () => {
		this.setState({
		  collapsed: !this.state.collapsed,
		});
	  };

	handleLogoutFailure = (err) => {
		console.error(err)
	}
	 handleLogoutSuccess = () => {
		alert("logged out successfully")
		this.props.logOutUser();
	}

	responseGoogle = response => {
        if (response.error) {
			console.error(response.error)
		}
		this.props.setUser({ ...response.profileObj, ...response.tokenObj })
		console.log("hi")
	}
	render() {
	return (
		<div>
	<Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}  style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
				<Link to="/">
				Home
				</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FireOutlined />}>
			<Link to="/trending">
				Trending
			</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
			<Link to="/playlists">
				Playlists
			</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: !this.state.collapsed ? 200 : 70 }}>
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
			})}
			 MTube
			<Search
      placeholder="search"
      onSearch={value => this.props.history.push(`/${value}`)}
      style={{ width: 500, marginLeft: 500 }}
	/>
	{ !this.props.user ? 
		<GoogleLogin
		clientId={config.CLIENT_ID}
		render={(renderProps) => (
			<Button variant="primary" style={{marginLeft: 400}}  onClick={renderProps.onClick} disabled={renderProps.disabled}>Login</Button> 
		)}
		buttonText="Login"
		onSuccess={this.responseGoogle}
		onFailure={this.responseGoogle}
		scope="https://www.googleapis.com/auth/youtube"
		cookiePolicy={'single_host_origin'}
	/>
		:
		<>
		<Link to='/profile'>
			<Button variant="primary" style={{marginLeft: 250, marginRight: 25}}>Profile</Button>
		</Link>
		<GoogleLogout clientId={config.CLIENT_ID} buttonText="Logout" 
		onLogoutSuccess={this.handleLogoutSuccess} onFailure={this.handleLogoutFailure} />
		</>
	 }
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px 0',
              padding: 24,
			  minHeight: 280,
			overflow: 'initial',
            }}
          >
        <Switch>
        <Route  exact path="/" component={HomePage}/>
		<Route exact path="/profile" component={ProfilePage} />
        <Route  exact path="/trending" component={TrendingPage}/>
		<Route  exact path="/videos/:videoId" component={VideoDetail} />
		<Route  exact path="/playlists" component={PlaylistPage} />
		<Route  exact path="/:searchQuery" component={SearchResultPage} />
        <Redirect to="/" />
      </Switch>
          </Content>
        </Layout>
      </Layout>
		</div>
	);
	}
};

const mapStateToProps = storeState => {
	return {
		user: storeState.features.users.user
	}
}

export default  withRouter(connect(mapStateToProps, { setUser,logOutUser })(Navbar));
