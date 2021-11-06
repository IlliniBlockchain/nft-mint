
import utilStyles from '../styles/utils.module.css'

const Section = ({ children, className }) => {
	return (
		<div className={utilStyles.section + " " + className}>
            <div className={utilStyles.column}>
				{children}
            </div>
		</div>
	)
}

export default Section;