import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'



export default function CreateGroupForm() {
  console.log("coordinates")
  console.log(auth.isAuthenticated().user.coordinates)
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')
const rule1Value = React.useRef('')
const rule2Value = React.useRef('')
const rule3Value = React.useRef('')
const rule4Value = React.useRef('')
const [toggle, setToggle] = useState(false);



function handleSubmit(e) {


    const newPost={
      title: titleValue.current.value,
      description:descriptionValue.current.value,
      centroid:auth.isAuthenticated().user.coordinates,
      rule1:rule1Value.current.value,
      rule2:rule2Value.current.value,
      rule3:rule3Value.current.value,
      rule4:rule4Value.current.value,

    }
    console.log(newPost)
    const options={
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      fetch("groups/add", options)
              .then(response => response.json()).then(json => console.log(json));


}


  return (
    <section className='section search'>
    <p>In Democracy Book, we aim to keep groups fairly small so that each member has an opportunity to speak and engage with
    discussions. We want a deliberative democracy where we try to reach decisions that are both well informed and as many people as possible
    are happy with them. We would also like you to get to know the people fairly well. If a group gets larger than 40 people, it breaks into two groups of 20, you get placed with the
    people geographically closest to you. You do not need to stay there, you can leave and go to the other group if you prefer.
    When groups split, a higher level group is formed to represent them both. It consists of 8 people chosen at random from
    the whole collection of 80 people (both bottom level groups) plus the 8 elected leaders from both bottom groups. This group
    will again need to elect 4 higher level leaders.
    If the bottom groups continue to expand and split, more members will be added to the upper level group. When it get's larger
    than 40 members it will split again forming a third level. This pattern of growth, splitting and forming higher level groups
    will repeat indefinately using the same pattern each time. All of this is a pragmatic attempt to ensure leadership is assigned
    based on merit rather than the leaders becoming an insular closed circle.

    "Higher level" groups do not in any way have the ability to impose rules on "lower level groups". Their main purpose is to
    promote communication and cooperation between groups. Newly formed higher level groups will inherit the rules of their lower groups
    but these rules will become independent and all groups will be able to separately adjust the rules according to their preference.
    If particular rules have some objective benefit, they should naturally be created and enforced by groups independently most groups
    will have these same rules. If rules are subjective, it doesn't make sense for groups to impose theirs onto each other or even
    really onto their own members, unless these rules are prerequisites for power being evenly distributed in the first place.
    In this case, the use of coercion is defensive and therefore not really coercion at all. It is no more a display of power and
    dominance than blocking a punch. We
    should aim to achieve unanimous consent to all decisions. This does not necessarily mean everyone whole heartedly
    agrees, but we show each other we value each other thoughts an opinions by listening to and compromising for each other.

    The dominance of an idea has nothing to do with whether or not it is true. Complicated scientific
    ideas described (not explained, real explanation could take years of studyd) in laymans terms can become dominant or common knowledge if they are interesting, profound or
    useful in some way. These ideas are not true because they are dominant or popular but because the experts say so. However, if these ideas challenge the hierarchy of power within the society, the elites will not allow
    those ideas to spread. This is essentially the reason we very seldom hear our society described as an "oligarchy" in the mass
    media and our academic institutions. Our school system will not teach people the basics of economics and politics because this
    information would expose our leaders as complete frauds and criminals.

    Think of Henry David Thoreau, the 19thc American libertarian philosopher. He chose to live a reclusive life because he found
    the economy of slavery extremely disturbing and inhumane. The only way he could see to live an ethical and free life was to
    live on a homestead farm and live a self sufficient lifestyle, without the need to work as a wage labourer or to become a slave
    owner. At the time, this may have been the only really viable alternative to being forced to choose between being exploited
    or becoming an exploiter.

    We fully admit that it may be very challenging reaching consensus and majority decisions may be a necessary compromise. We should
    just keep in mind that unanimity is ideally what we should be aiming for, ambitious though it might be.
    </p>
      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='titleValue'
          id='titleValue'
          ref={titleValue}

        />
        <label htmlFor='name'>Description</label>
        <input
          type='text'
          name='descriptionValue'
          id='descriptionValue'
          ref={descriptionValue}

        />
        <label htmlFor='name'>Rule 1</label>
        <input
          type='text'
          name='rule1Value'
          id='rule1Value'
          ref={rule1Value}

        />
          <label htmlFor='name'>Rule 2</label>
        <input
          type='text'
          name='rule2Value'
          id='rule2Value'
          ref={rule2Value}
        />
        <label htmlFor='name'>Rule 3</label>
        <input
          type='text'
          name='rule3Value'
          id='rule3Value'
          ref={rule3Value}

        />
          <label htmlFor='name'>Rule 4</label>
        <input
          type='text'
          name='rule4Value'
          id='rule4Value'
          ref={rule4Value}
        />

          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
  )}
