import '../css/about.css'

function About() {
    return (
        <div class="tabs">
            <div class="tab-header">
                <div class="active">
                    <i class="fa fa-code"></i> Code
                </div>
                <div>
                    <i class="fa fa-pencil-square-o"></i> About
                </div>
                <div>
                    <i class="fa fa-bar-chart"></i> Services
                </div>
                <div>
                    <i class="fa fa-envelope-o"></i> Contact
                </div>
            </div>
            <div class="tab-indicator"></div>
            <div class="tab-body">
                <div class="active">
                    <h2>This is code section</h2>
                    <p>Example text</p>
                </div>
                <div>
                    <h2>This is about section</h2>
                    <p>Example text</p>
                </div>
                <div>
                    <h2>This is services section</h2>
                    <p>Example text</p>
                </div>
                <div>
                    <h2>This is contact section</h2>
                    <p>Example text</p>
                </div>
            </div>
        </div>
    )
}

export default About