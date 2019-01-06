var React = require('react');
var PropsTypes = require('prop-types');
var api = require('../utils/Api');

function SelectLanguage(props) {
    var languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];
        
    return (
        <ul className = 'languages'>
            {languages.map(function(lang) {
                return(
                    <li 
                        style = {lang === props.selectedLanguage ? { color: 'red' }: null}
                        onClick = {props.onSelect.bind(null, lang)}
                        key = {lang}>
                        {lang}
                    </li>
                )
            })}
        </ul>
    )
}

function RepoGrid(props) {
    return (
        <ul className='popular-list'>
            {props.repos.map((repo, index) => {
                return (
                    <li key={repo.name} className='popular-item'>
                        <div className='popular-rank'>#{index + 1}</div>
                        <ul className='space-list-items'>
                            <li>
                                <img 
                                    className='avatar'
                                    src={repo.owner.avatar_url}
                                    alt={'Avatar for ' + repo.owner.login} />
                            </li>
                            <li><a href={repo.html_url}>{repo.name}</a></li>
                            <li>@{repo.owner.login}</li>
                            <li>{repo.stargazers_count}</li>
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
}

RepoGrid.propTypes = {
    repos: PropsTypes.array.isRequired
}

SelectLanguage.propTypes = {
    selectedLanguage: PropsTypes.string.isRequired,
    onSelect: PropsTypes.func.isRequired
}

class Popular extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLanguage: 'All',
            repos: null
        };

        this.updateLanguages = this.updateLanguages.bind(this);
    }

    componentDidMount() {
        this.updateLanguages(this.state.selectedLanguage);
    }

    updateLanguages(lang) {
        this.setState({
            selectedLanguage: lang
        });

        api.fetchPopularRepos(lang)
            .then(function(repos) {
                this.setState({
                    repos: repos
                });
            }.bind(this));
    }

    render() {        
        return (
            <div>
                <SelectLanguage selectedLanguage = {this.state.selectedLanguage} onSelect = {this.updateLanguages}/>
                {!this.state.repos 
                 ? <p>LOADING</p>
                 : <RepoGrid repos = {this.state.repos} />}
            </div>
        )
    }
}

module.exports = Popular;